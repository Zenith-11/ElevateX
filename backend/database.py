from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://TODO:todo@cluster0.x4djh.mongodb.net/elevatex_db?appName=Cluster0")
client = AsyncIOMotorClient(MONGO_URI)
db = client.elevatex_db
