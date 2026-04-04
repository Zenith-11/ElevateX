from fastapi import APIRouter, Depends, HTTPException, Query, status

from db import get_db
from auth import get_current_user, require_roles
from services.user_services import UserService
from models.user import UserResponse, UserUpdate, UserRoleUpdate, UserRole

router = APIRouter(prefix="/api/users", tags=["Users"])


# ───────────────────────── List Users (Admin) ─────────────────────────


@router.get("/", response_model=list[UserResponse])
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(require_roles(UserRole.ADMIN)),
    db=Depends(get_db),
):
    """List all users with pagination. Admin only."""
    user_service = UserService(db)
    return await user_service.get_all_users(skip=skip, limit=limit)


# ───────────────────────── Get User Profile ─────────────────────────


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get a user's profile by ID. Any authenticated user can view profiles."""
    user_service = UserService(db)
    user = await user_service.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


# ───────────────────────── Update User Profile ─────────────────────────


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    update_data: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """
    Update a user's profile.
    - Users can update their own profile.
    - Admins can update any profile.
    """
    current_user_id = str(current_user["_id"])
    is_admin = current_user.get("role") == UserRole.ADMIN.value

    if current_user_id != user_id and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own profile",
        )

    user_service = UserService(db)
    return await user_service.update_user(user_id, update_data)


# ───────────────────────── Update User Role (Admin) ─────────────────────────


@router.put("/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: str,
    role_data: UserRoleUpdate,
    current_user: dict = Depends(require_roles(UserRole.ADMIN)),
    db=Depends(get_db),
):
    """Change a user's role. Admin only."""
    user_service = UserService(db)
    return await user_service.update_role(user_id, role_data.role)


# ───────────────────────── Delete User (Admin) ─────────────────────────


@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
async def delete_user(
    user_id: str,
    current_user: dict = Depends(require_roles(UserRole.ADMIN)),
    db=Depends(get_db),
):
    """Delete a user by ID. Admin only."""
    # Prevent admin from deleting themselves
    if str(current_user["_id"]) == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own account",
        )

    user_service = UserService(db)
    await user_service.delete_user(user_id)
    return {"message": "User deleted successfully"}
