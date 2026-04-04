from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class EventStatus(str, Enum):
    draft = "draft"
    active = "active"
    closed = "closed"
    archived = "archived"

class EventBase(BaseModel):
    title: str
    description: str
    type: str # e.g. Hackathon, Workshop, Fitness
    department: str
    difficulty: str
    deadline: datetime
    reward_points: int = Field(gt=0)
    max_participants: int = Field(gt=0)
    tags: List[str] = []

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    department: Optional[str] = None
    difficulty: Optional[str] = None
    deadline: Optional[datetime] = None
    reward_points: Optional[int] = None
    max_participants: Optional[int] = None
    status: Optional[EventStatus] = None
    tags: Optional[List[str]] = None

class Event(EventBase):
    id: str = Field(alias="_id")
    current_participants: int = 0
    status: EventStatus = EventStatus.draft
    created_by: str = "AdminUser" # Mocked
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(populate_by_name=True)
