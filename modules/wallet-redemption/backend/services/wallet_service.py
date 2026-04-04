from bson import ObjectId
from datetime import datetime, timedelta
from fastapi import HTTPException
from models.wallet import RedemptionCreate, RewardCreate, RewardUpdate


class WalletService:
    def __init__(self, db):
        self.db = db

    async def get_balance(self, user_id: ObjectId) -> dict:
        """Get user's wallet balance with detailed breakdown"""
        user = await self.db.users.find_one({"_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        earned_agg = await self.db.transactions.aggregate([
            {"$match": {"user_id": str(user_id), "type": "earn"}},
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
        ]).to_list(None)

        redeemed_agg = await self.db.transactions.aggregate([
            {"$match": {"user_id": str(user_id), "type": "redeem"}},
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
        ]).to_list(None)

        tx_count = await self.db.transactions.count_documents({"user_id": str(user_id)})

        return {
            "total_points": user.get("points", 0),
            "earned_points": earned_agg[0]["total"] if earned_agg else 0,
            "redeemed_points": redeemed_agg[0]["total"] if redeemed_agg else 0,
            "badges": user.get("badges", []),
            "transaction_count": tx_count,
        }

    async def get_balance_by_user_id(self, user_id: str) -> dict:
        """Get balance for a specific user by user_id string"""
        try:
            user_obj_id = ObjectId(user_id)
        except Exception:
            raise HTTPException(status_code=404, detail="Invalid user ID")
        
        return await self.get_balance(user_obj_id)

    async def list_transactions(self, user_id: str, skip: int = 0, limit: int = 20) -> dict:
        """Get paginated transaction history"""
        txs = await self.db.transactions.find(
            {"user_id": user_id}
        ).sort("timestamp", -1).skip(skip).limit(limit).to_list(None)

        total = await self.db.transactions.count_documents({"user_id": user_id})

        transactions = [{
            "id": str(t["_id"]),
            "user_id": t["user_id"],
            "type": t["type"],
            "amount": t["amount"],
            "description": t["description"],
            "reference_id": t.get("reference_id"),
            "timestamp": t["timestamp"],
        } for t in txs]

        return {
            "data": transactions,
            "total": total,
            "skip": skip,
            "limit": limit,
        }

    async def list_rewards(self, skip: int = 0, limit: int = 20) -> dict:
        """Get paginated list of active rewards"""
        rewards = await self.db.rewards.find(
            {"is_active": True, "inventory": {"$gt": 0}}
        ).skip(skip).limit(limit).to_list(None)

        total = await self.db.rewards.count_documents(
            {"is_active": True, "inventory": {"$gt": 0}}
        )

        reward_list = [{
            "id": str(r["_id"]),
            "name": r["name"],
            "description": r["description"],
            "cost_points": r.get("cost_points", r.get("points_required", 0)),
            "category": r.get("category", "general"),
            "inventory": r["inventory"],
            "image_url": r.get("image_url", ""),
        } for r in rewards]

        return {
            "data": reward_list,
            "total": total,
            "skip": skip,
            "limit": limit,
        }

    async def list_all_rewards(self, skip: int = 0, limit: int = 50) -> dict:
        """Get all rewards including inactive (Admin endpoint)"""
        rewards = await self.db.rewards.find({}).skip(skip).limit(limit).to_list(None)
        total = await self.db.rewards.count_documents({})

        reward_list = [{
            "id": str(r["_id"]),
            "name": r["name"],
            "description": r["description"],
            "cost_points": r.get("cost_points", r.get("points_required", 0)),
            "category": r.get("category", "general"),
            "inventory": r["inventory"],
            "is_active": r.get("is_active", True),
            "image_url": r.get("image_url", ""),
            "created_at": r.get("created_at"),
        } for r in rewards]

        return {
            "data": reward_list,
            "total": total,
            "skip": skip,
            "limit": limit,
        }

    async def create_reward(self, data: RewardCreate) -> dict:
        """Create a new reward (Admin)"""
        reward_doc = {
            "name": data.name,
            "description": data.description,
            "cost_points": data.points_required,
            "points_required": data.points_required,
            "stock": data.stock,
            "inventory": data.stock,
            "is_active": data.is_active,
            "image_url": data.image_url or "",
            "category": data.category or "general",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }

        result = await self.db.rewards.insert_one(reward_doc)

        return {
            "id": str(result.inserted_id),
            "message": f"Reward '{data.name}' created successfully",
        }

    async def update_reward(self, reward_id: str, data: RewardUpdate) -> dict:
        """Update reward details (Admin)"""
        try:
            reward_obj_id = ObjectId(reward_id)
        except Exception:
            raise HTTPException(status_code=404, detail="Reward not found")

        update_data = {}
        if data.name is not None:
            update_data["name"] = data.name
        if data.description is not None:
            update_data["description"] = data.description
        if data.points_required is not None:
            update_data["cost_points"] = data.points_required
            update_data["points_required"] = data.points_required
        if data.stock is not None:
            update_data["stock"] = data.stock
            update_data["inventory"] = data.stock
        if data.is_active is not None:
            update_data["is_active"] = data.is_active
        if data.image_url is not None:
            update_data["image_url"] = data.image_url
        if data.category is not None:
            update_data["category"] = data.category

        update_data["updated_at"] = datetime.utcnow()

        result = await self.db.rewards.update_one(
            {"_id": reward_obj_id},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Reward not found")

        return {"message": "Reward updated successfully"}

    async def delete_reward(self, reward_id: str) -> dict:
        """Delete a reward (Admin)"""
        try:
            reward_obj_id = ObjectId(reward_id)
        except Exception:
            raise HTTPException(status_code=404, detail="Reward not found")

        result = await self.db.rewards.delete_one({"_id": reward_obj_id})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Reward not found")

        return {"message": "Reward deleted successfully"}

    async def redeem_reward(self, user_id: ObjectId, data: RedemptionCreate) -> dict:
        """Redeem a reward with points"""
        try:
            reward = await self.db.rewards.find_one({"_id": ObjectId(data.reward_id)})
        except Exception:
            raise HTTPException(status_code=404, detail="Reward not found")

        if not reward:
            raise HTTPException(status_code=404, detail="Reward not found")

        user = await self.db.users.find_one({"_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        cost_points = reward.get("cost_points", reward.get("points_required", 0))

        if user.get("points", 0) < cost_points:
            raise HTTPException(status_code=400, detail="Insufficient points")

        if reward.get("inventory", 0) <= 0:
            raise HTTPException(status_code=400, detail="Reward out of stock")

        # Atomic updates
        await self.db.users.update_one(
            {"_id": user_id},
            {"$inc": {"points": -cost_points}}
        )

        await self.db.rewards.update_one(
            {"_id": ObjectId(data.reward_id)},
            {"$inc": {"inventory": -1}}
        )

        await self.db.transactions.insert_one({
            "user_id": str(user_id),
            "type": "redeem",
            "amount": cost_points,
            "description": f"Redeemed: {reward['name']}",
            "reference_id": data.reward_id,
            "timestamp": datetime.utcnow(),
        })

        return {"message": f"Successfully redeemed {reward['name']}"}

    async def get_leaderboard(self, skip: int = 0, limit: int = 50) -> dict:
        """Get global leaderboard sorted by points"""
        pipeline = [
            {"$sort": {"points": -1}},
            {"$skip": skip},
            {"$limit": limit},
            {
                "$project": {
                    "_id": 0,
                    "user_id": {"$toString": "$_id"},
                    "username": "$username",
                    "email": "$email",
                    "points": 1,
                    "badges": 1,
                }
            }
        ]

        users = await self.db.users.aggregate(pipeline).to_list(None)

        # Add rank
        leaderboard = []
        for idx, user in enumerate(users, start=skip + 1):
            user["rank"] = idx
            leaderboard.append(user)

        total = await self.db.users.count_documents({})

        return {
            "data": leaderboard,
            "total": total,
            "skip": skip,
            "limit": limit,
        }

    async def get_points_summary(self, user_id: ObjectId) -> dict:
        """Get points summary including rank and milestones"""
        user = await self.db.users.find_one({"_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get rank
        rank_pipeline = [
            {"$sort": {"points": -1}},
            {
                "$group": {
                    "_id": None,
                    "users": {"$push": {"user_id": "$_id", "points": "$points"}}
                }
            },
            {
                "$project": {
                    "rank": {
                        "$add": [
                            {
                                "$indexOfArray": [
                                    "$users.user_id",
                                    user_id
                                ]
                            },
                            1
                        ]
                    }
                }
            }
        ]

        rank_result = await self.db.users.aggregate(rank_pipeline).to_list(1)
        rank = rank_result[0]["rank"] if rank_result else 0

        # Get month statistics
        month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        earned_this_month = await self.db.transactions.aggregate([
            {
                "$match": {
                    "user_id": str(user_id),
                    "type": "earn",
                    "timestamp": {"$gte": month_start}
                }
            },
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
        ]).to_list(None)

        redeemed_this_month = await self.db.transactions.aggregate([
            {
                "$match": {
                    "user_id": str(user_id),
                    "type": "redeem",
                    "timestamp": {"$gte": month_start}
                }
            },
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
        ]).to_list(None)

        current_points = user.get("points", 0)
        next_milestone = ((current_points // 100) + 1) * 100

        return {
            "total_points": current_points,
            "earned_this_month": earned_this_month[0]["total"] if earned_this_month else 0,
            "redeemed_this_month": redeemed_this_month[0]["total"] if redeemed_this_month else 0,
            "rank": rank,
            "next_milestone": next_milestone,
            "progress_to_milestone": next_milestone - current_points,
        }

    async def award_points(self, user_id: ObjectId, amount: int, source: str, reference_id: str = None) -> dict:
        """Award points to a user (called from submission/event services)"""
        if amount <= 0:
            raise HTTPException(status_code=400, detail="Amount must be positive")

        user = await self.db.users.find_one({"_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Update user points
        await self.db.users.update_one(
            {"_id": user_id},
            {"$inc": {"points": amount}}
        )

        # Record transaction
        await self.db.transactions.insert_one({
            "user_id": str(user_id),
            "type": "earn",
            "amount": amount,
            "source": source,
            "reference_id": reference_id or "",
            "description": f"Points awarded: {source}",
            "timestamp": datetime.utcnow(),
        })

        return {"message": f"Successfully awarded {amount} points"}

