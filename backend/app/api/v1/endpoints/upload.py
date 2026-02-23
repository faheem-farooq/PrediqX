from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.data_processor import data_processor
from app.core.config import settings
from app.schemas.data import UploadResponse, EDAResponse
import shutil
import os
import uuid

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    file_id = str(uuid.uuid4())
    file_path = os.path.join(settings.UPLOAD_DIR, f"{file_id}.csv")

    try:
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process for metadata (read again from disk or keep in memory if small)
        with open(file_path, "rb") as f:
            content = f.read()
            metadata = data_processor.process_csv(content)

        return {
            "file_id": file_id,
            "filename": file.filename,
            "rows": metadata["rows"],
            "columns": metadata["columns"],
            "column_names": metadata["column_names"],
            "message": "File uploaded successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/eda/{file_id}", response_model=EDAResponse)
async def get_eda(file_id: str):
    file_path = os.path.join(settings.UPLOAD_DIR, f"{file_id}.csv")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found.")

    try:
        eda_stats = data_processor.get_eda_summary(file_path)
        return {
            "file_id": file_id,
            "dataset_overview": eda_stats["dataset_overview"],
            "numerical_analysis": eda_stats["numerical_analysis"],
            "categorical_analysis": eda_stats["categorical_analysis"],
            "correlation_matrix": eda_stats["correlation_matrix"],
            "target_distribution": eda_stats["target_distribution"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
