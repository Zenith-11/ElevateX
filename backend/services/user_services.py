from datetime import datetime, timedelta, timezone
from typing import Optional
from bson import ObjectId
from fastapi import HTTPException, status
from models.user import UserCreate, UserUpdate, UserRole
from core.security import hash_password, verify_password
import uuid


class UserService:
    def __init__(self, db):
        self.collection = db.users
        self.reset_tokens = db.password_reset_tokens

    # --------------- Read ---------------

    async def get_by_email(self, email: str) -> Optional[dict]:
        return await self.collection.find_one({"email": email})

    async def get_by_id(self, user_id: str) -> Optional[dict]:
        if not ObjectId.is_valid(user_id):
            return None
        return await self.collection.find_one({"_id": ObjectId(user_id)})

    async def get_all_users(self, skip: int = 0, limit: int = 20) -> list[dict]:
        # Filter for well-formed documents that have all required fields
        query = {"email": {"$exists": True}, "name": {"$exists": True}}
        cursor = self.collection.find(query).skip(skip).limit(limit)
        return await cursor.to_list(length=limit)

    # --------------- Create ---------------

    async def create_user(self, user_in: UserCreate) -> dict:
        # Check for duplicate email
        existing = await self.get_by_email(user_in.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email already exists",
            )

        user_dict = user_in.model_dump()
        user_dict["password_hash"] = hash_password(user_dict.pop("password"))
        now = datetime.now(timezone.utc)
        user_dict["created_at"] = now
        user_dict["updated_at"] = now

        result = await self.collection.insert_one(user_dict)
        return await self.collection.find_one({"_id": result.inserted_id})

    # --------------- Update ---------------

    async def update_user(self, user_id: str, update_data: UserUpdate) -> dict:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format",
            )

        # Build update dict from non-None fields only
        updates = update_data.model_dump(exclude_none=True)
        if not updates:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update",
            )

        # Hash password if it's being updated
        if "password" in updates:
            updates["password_hash"] = hash_password(updates.pop("password"))

        updates["updated_at"] = datetime.now(timezone.utc)

        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": updates},
        )
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return await self.collection.find_one({"_id": ObjectId(user_id)})

    async def update_role(self, user_id: str, new_role: UserRole) -> dict:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format",
            )

        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"role": new_role.value, "updated_at": datetime.now(timezone.utc)}},
        )
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return await self.collection.find_one({"_id": ObjectId(user_id)})

    # --------------- Delete ---------------

    async def delete_user(self, user_id: str) -> bool:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format",
            )

        result = await self.collection.delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return True

    # --------------- Authentication ---------------

    async def authenticate(self, email: str, password: str) -> Optional[dict]:
        """Verify email + password. Returns user dict or None."""
        user = await self.get_by_email(email)
        if not user:
            return None
        if not verify_password(password, user["password_hash"]):
            return None
        return user

    # --------------- Password Reset ---------------

    async def generate_password_reset_token(self, email: str) -> Optional[str]:
        """Create a password reset token if the user exists. Returns the token."""
        user = await self.get_by_email(email)
        if not user:
            return None  # Don't reveal whether email exists

        token = str(uuid.uuid4())
        await self.reset_tokens.insert_one({
            "token": token,
            "user_id": user["_id"],
            "expires_at": datetime.now(timezone.utc) + timedelta(hours=1),
            "created_at": datetime.now(timezone.utc),
        })
        return token

    async def reset_password(self, token: str, new_password: str) -> bool:
        """Validate reset token and update the user's password."""
        doc = await self.reset_tokens.find_one({"token": token})
        if not doc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token",
            )

        # Check expiry manually as well (belt and suspenders with TTL)
        if doc["expires_at"].replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            await self.reset_tokens.delete_one({"_id": doc["_id"]})
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset token has expired",
            )

        # Update password
        hashed = hash_password(new_password)
        await self.collection.update_one(
            {"_id": doc["user_id"]},
            {"$set": {"password_hash": hashed, "updated_at": datetime.now(timezone.utc)}},
        )

        # Remove the used token
        await self.reset_tokens.delete_one({"_id": doc["_id"]})
        return True
    


