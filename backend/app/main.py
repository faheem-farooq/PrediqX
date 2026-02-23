from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title="PrediqX API",
    description="Backend for PrediqX - Machine Learning–Driven Business Decision Support System",
    version="1.0.0",
)

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite frontend
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to PrediqX API"}
