from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from app.services.data_processor import data_processor
from app.services.genai_service import genai_service
from app.services.llm_engine import llm_engine
from app.core.config import settings
import os

router = APIRouter()

class AnalystReportRequest(BaseModel):
    file_id: str

class Recommendation(BaseModel):
    action: str
    impact: str
    effort: str
    priority: str

class ChecklistItem(BaseModel):
    item: str
    status: bool

class ModelReadiness(BaseModel):
    status: str
    checklist: List[ChecklistItem]

class AnalystReportResponse(BaseModel):
    data_quality_score: int
    analysis_confidence_score: int
    executive_summary: str
    key_patterns: List[str]
    risk_flags: List[str]
    model_readiness: ModelReadiness
    segment_insights: List[str]
    recommended_actions: List[Recommendation]
    data_quality_notes: List[str]

class AskAnalystRequest(BaseModel):
    file_id: str
    question: str

class AskAnalystResponse(BaseModel):
    answer: str

@router.post("/report", response_model=AnalystReportResponse)
async def generate_analyst_report(request: AnalystReportRequest):
    file_path = os.path.join(settings.UPLOAD_DIR, f"{request.file_id}.csv")
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        eda_summary = data_processor.get_eda_summary(file_path)
        report = llm_engine.generate_report(eda_summary)
        return report

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")

@router.post("/ask", response_model=AskAnalystResponse)
async def ask_analyst(request: AskAnalystRequest):
    file_path = os.path.join(settings.UPLOAD_DIR, f"{request.file_id}.csv")
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        eda_summary = data_processor.get_eda_summary(file_path)
        answer = llm_engine.generate_chat_response(eda_summary, request.question)
        return {"answer": answer}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating answer: {str(e)}")
