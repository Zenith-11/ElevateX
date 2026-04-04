from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.submission_routes import router as submission_router

app = FastAPI()

# ✅ ADD THIS HERE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(submission_router)


@app.get("/")
def root():
    return {"message": "Backend running 🚀"}