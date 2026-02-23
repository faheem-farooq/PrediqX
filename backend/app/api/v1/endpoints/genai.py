from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any
from app.services.genai_service import genai_service

router = APIRouter()

class InsightRequest(BaseModel):
    eda_summary: Dict[str, Any]

class InsightResponse(BaseModel):
    insight: str

@router.post("/insight", response_model=InsightResponse)
async def generate_insight(request: InsightRequest):
    insight = genai_service.generate_insight(request.eda_summary)
    return {"insight": insight}
