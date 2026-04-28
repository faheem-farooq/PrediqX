import sys
import asyncio
from fastapi import UploadFile
import io
import os
import shutil
import uuid

# setup path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from app.services.data_processor import data_processor
from app.core.config import settings

def mock_upload():
    file_content = b"A,B\n1,2\n3,4"
    file_obj = io.BytesIO(file_content)
    file = UploadFile(filename="test.csv", file=file_obj)
    
    file_id = str(uuid.uuid4())
    file_path = os.path.join(settings.UPLOAD_DIR, f"{file_id}.csv")
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    with open(file_path, "rb") as f:
        content = f.read()
        metadata = data_processor.process_csv(content)
        
    print(metadata)

mock_upload()
