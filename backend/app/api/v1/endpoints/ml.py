from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ml_engine import ml_engine
from app.core.config import settings
import os

router = APIRouter()

class TrainRequest(BaseModel):
    file_id: str
    target_column: str
    problem_type: str = "classification"  # or "regression"

class TrainResponse(BaseModel):
    metrics: dict
    feature_importance: dict

@router.post("/train", response_model=TrainResponse)
async def train_model(request: TrainRequest):
    file_path = os.path.join(settings.UPLOAD_DIR, f"{request.file_id}.csv")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found.")
    
    try:
        result = ml_engine.train_baseline(file_path, request.target_column, request.problem_type)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
