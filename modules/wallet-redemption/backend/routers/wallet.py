from fastapi import APIRouter, Depends, HTTPException, Query
from database import get_database
from auth import get_current_user
from models.wallet import (
    RedemptionCreate,
    RewardCreate,
    RewardUpdate,
    RewardResponse,
    TransactionResponse,
    LeaderboardEntry,
    PointsSummary,
)
from services.wallet_service import WalletService

router = APIRouter(prefix="/api/wallet", tags=["wallet"])


def get_wallet_service(db=Depends(get_database)):
    return WalletService(db)


# ==================== USER WALLET ENDPOINTS ====================

@router.get("/balance")
async def get_balance(
    current_user=Depends(get_current_user),
    service: WalletService = Depends(get_wallet_service)
):
    """Get user's current points balance"""
    return await service.get_balance(current_user["_id"])


@router.get("/history")
async def get_transaction_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user=Depends(get_current_user),
    service: WalletService = Depends(get_wallet_service)
):
    """Get points transaction history with pagination"""
    return await service.list_transactions(str(current_user["_id"]), skip, limit)


@router.get("/rewards")
async def get_available_rewards(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    service: WalletService = Depends(get_wallet_service)
):
    """List available rewards to redeem"""
    return await service.list_rewards(skip, limit)


@router.post("/redeem")
async def redeem_reward(
    data: RedemptionCreate,
    current_user=Depends(get_current_user),
    service: WalletService = Depends(get_wallet_service)
):
    """Redeem a reward using points"""
    return await service.redeem_reward(current_user["_id"], data)


@router.get("/leaderboard")
async def get_leaderboard(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    service: WalletService = Depends(get_wallet_service)
):
    """Get global leaderboard - top users by points"""
    return await service.get_leaderboard(skip, limit)


@router.get("/summary")
async def get_points_summary(
    current_user=Depends(get_current_user),
    service: WalletService = Depends(get_wallet_service)
):
    """Get points summary including rank and milestones"""
    return await service.get_points_summary(current_user["_id"])


# ==================== USER POINTS ENDPOINT ====================

@router.get("/users/{user_id}/points")
async def get_user_points(
    user_id: str,
    service: WalletService = Depends(get_wallet_service)
):
    """Get specific user's point balance (public endpoint)"""
    return await service.get_balance_by_user_id(user_id)


# ==================== ADMIN REWARD MANAGEMENT ====================

@router.post("/admin/rewards", dependencies=[Depends(get_current_user)])
async def create_reward(
    data: RewardCreate,
    current_user=Depends(get_current_user),
    service: WalletService = Depends(get_wallet_service)
):
    """Create a new reward (Admin only)"""
    if current_user.get("role") not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return await service.create_reward(data)


@router.put("/admin/rewards/{reward_id}")
async def update_reward(
    reward_id: str,
    data: RewardUpdate,
    current_user=Depends(get_current_user),
    service: WalletService = Depends(get_wallet_service)
):
    """Update reward details (Admin only)"""
    if current_user.get("role") not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return await service.update_reward(reward_id, data)


@router.delete("/admin/rewards/{reward_id}")
async def delete_reward(
    reward_id: str,
    current_user=Depends(get_current_user),
    service: WalletService = Depends(get_wallet_service)
):
    """Delete a reward (Admin only)"""
    if current_user.get("role") not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return await service.delete_reward(reward_id)


@router.get("/admin/rewards")
async def get_all_rewards_admin(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user=Depends(get_current_user),
    service: WalletService = Depends(get_wallet_service)
):
    """Get all rewards (Admin - includes inactive)"""
    if current_user.get("role") not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return await service.list_all_rewards(skip, limit)

