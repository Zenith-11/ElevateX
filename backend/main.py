from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
from db import connect_to_mongo, close_mongo_connection, get_db
from core.config import settings

from models.user import UserCreate, UserResponse
from services.user_services import UserService

@asynccontextmanager
async def lifespan(app: FastAPI):
    
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    lifespan=lifespan,
    title=settings.PROJECT_NAME
)


@app.get("/health")
def health_check():
    return {"status": "online", "database": "connected"}


@app.post("/test-register", response_model=UserResponse)
async def test_register(user_in: UserCreate, database = Depends(get_db)):
    user_service = UserService(database)
    new_user = await user_service.create_user(user_in)
    return new_user