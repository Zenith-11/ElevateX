from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SubmissionCreate(BaseModel):
    event_id: str
    user_id: str
    description: Optional[str] = ""

class SubmissionUpdate(BaseModel):
    description: Optional[str] = ""

class SubmissionResponse(BaseModel):
    id: str
    event_id: str
    user_id: str
    description: str
    file_urls: List[str]
    status: str
    submitted_at: datetime
    reviewed_at: Optional[datetime]
    reviewer_id: Optional[str]
    rejection_reason: Optional[str]
    points_awarded: Optional[int]