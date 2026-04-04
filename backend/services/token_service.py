from datetime import datetime, timezone


class TokenService:
    """Manages token blacklisting for logout / invalidation."""

    def __init__(self, db):
        self.collection = db.blacklisted_tokens

    async def blacklist_token(self, jti: str, expires_at: datetime) -> None:
        """Add a token's jti to the blacklist. It will be auto-purged by TTL index."""
        await self.collection.insert_one({
            "jti": jti,
            "expires_at": expires_at,
            "blacklisted_at": datetime.now(timezone.utc),
        })

    async def is_blacklisted(self, jti: str) -> bool:
        """Check if a token has been revoked."""
        doc = await self.collection.find_one({"jti": jti})
        return doc is not None
