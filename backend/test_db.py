import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError, OperationFailure
import os
from dotenv import load_dotenv

load_dotenv()

async def test_conn():
    MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://TODO:todo@cluster0.x4djh.mongodb.net/elevatex_db?appName=Cluster0")
    client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    try:
        info = await client.server_info()
        print("Success: Connected to MongoDB!")
    except OperationFailure as e:
        print(f"Auth_Error: {e}")
    except ServerSelectionTimeoutError as e:
        print(f"Timeout_Error: IP Whitelist or Unreachable Cluster => {e}")
    except Exception as e:
        print(f"Other_Error: {e}")

asyncio.run(test_conn())
