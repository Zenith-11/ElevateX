from datetime import datetime, timezone
from bson import ObjectId
from models.user import UserCreate
from core.security import hash_password
from db import db_instance


class UserService:
    def __init__(self, db_instance):
        self.collection = db_instance.users
        
    async def get_by_email(self, email: str):
        return await self.collection.find_one({"email": email})
    
    async def create_user(self, user_in: UserCreate):
        user_dict = user_in.model_dump()
        user_dict["password_hash"] = hash_password(user_dict.pop("password"))
        user_dict["created_at"] = datetime.now(timezone.utc)
        user_dict["updated_at"] = datetime.now(timezone.utc)
        
        result = await self.collection.insert_one(user_dict)
        return await self.collection.find_one({"_id": result.inserted_id})