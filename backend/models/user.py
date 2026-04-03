from pydantic import BaseModel, EmailStr, Field, BeforeValidator
from typing import Optional, Annotated
from datetime import datetime
from enum import Enum

PyObjectId = Annotated[str, BeforeValidator(str)]

class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    EMPLOYEE = "employee"

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole = UserRole.EMPLOYEE
    department: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

    class config:
        populate_by_name = True