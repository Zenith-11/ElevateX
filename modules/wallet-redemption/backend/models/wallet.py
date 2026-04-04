from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RedemptionCreate(BaseModel):
    reward_id: str


class WalletResponse(BaseModel):
    user_id: str
    balance: int
    total_earned: int
    total_spent: int
    last_updated: datetime


class TransactionCreate(BaseModel):
    user_id: str
    type: str  # "award" or "redeem"
    amount: int
    source: str  # "submission_approval" or "reward_redemption"
    reference_id: Optional[str] = None


class TransactionResponse(BaseModel):
    id: str
    user_id: str
    type: str
    amount: int
    source: str
    reference_id: Optional[str]
    created_at: datetime


class RewardCreate(BaseModel):
    name: str
    description: str
    points_required: int
    stock: int
    is_active: bool = True
    image_url: Optional[str] = None
    category: Optional[str] = None


class RewardUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    points_required: Optional[int] = None
    stock: Optional[int] = None
    is_active: Optional[bool] = None
    image_url: Optional[str] = None
    category: Optional[str] = None


class RewardResponse(BaseModel):
    id: str
    name: str
    description: str
    points_required: int
    stock: int
    is_active: bool
    image_url: Optional[str]
    category: Optional[str]
    created_at: datetime


class LeaderboardEntry(BaseModel):
    rank: int
    user_id: str
    username: str
    points: int
    events_participated: int
    submissions_completed: int


class PointsSummary(BaseModel):
    total_points: int
    earned_this_month: int
    redeemed_this_month: int
    rank: int
    next_milestone: int
