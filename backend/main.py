from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from db import connect_to_mongo, close_mongo_connection, create_indexes
from core.config import settings
from api.auth_routes import router as auth_router
from api.user_routes import router as user_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    await create_indexes()
    yield
    await close_mongo_connection()


app = FastAPI(
    lifespan=lifespan,
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

# ───────────── CORS (required for HTTP-only cookies) ─────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,                   # Allow cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# ───────────── Routers ─────────────
app.include_router(auth_router)
app.include_router(user_router)


# ───────────── Health ─────────────
@app.get("/health")
def health_check():
    return {"status": "online", "database": "connected"}