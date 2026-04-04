from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings
import pymongo


class Database:
    client: AsyncIOMotorClient = None
    db = None


db_instance = Database()


async def connect_to_mongo():
    db_instance.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db_instance.db = db_instance.client[settings.DATABASE_NAME]
    print("Connected to MongoDB")


async def close_mongo_connection():
    db_instance.client.close()
    print("Closed MongoDB connection")


async def create_indexes():
    """Create required MongoDB indexes on startup."""
    db = db_instance.db

    try:
        # Unique index on email for fast lookups and duplicate prevention
        await db.users.create_index("email", unique=True)
    except pymongo.errors.DuplicateKeyError:
        print(
            "WARNING: Could not create unique index on users.email — "
            "duplicate email values exist in the collection. "
            "Please remove duplicate documents and restart."
        )

    await db.users.create_index("role")

    # index on blacklisted tokens — for auto-deleting expired entries
    await db.blacklisted_tokens.create_index(
        "expires_at",
        expireAfterSeconds=0,
    )

    # Index on password reset tokens for fast lookup
    await db.password_reset_tokens.create_index(
        "expires_at",
        expireAfterSeconds=0,
    )
    await db.password_reset_tokens.create_index("token", unique=True)

    print("MongoDB indexes created")


def get_db():
    return db_instance.db