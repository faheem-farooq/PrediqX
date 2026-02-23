from fastapi import APIRouter
from app.api.v1.endpoints import upload, ml, genai, analyst

api_router = APIRouter()

api_router.include_router(upload.router, prefix="/data", tags=["Data"])
api_router.include_router(ml.router, prefix="/ml", tags=["ML"])
api_router.include_router(genai.router, prefix="/genai", tags=["GenAI"])
api_router.include_router(analyst.router, prefix="/analyst", tags=["Analyst"])
