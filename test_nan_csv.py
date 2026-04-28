import asyncio
from fastapi import FastAPI
from fastapi.testclient import TestClient
from backend.app.api.v1.endpoints import upload
import io

app = FastAPI()
app.include_router(upload.router, prefix="/api/v1/data")

client = TestClient(app)
content = b"A,B\n1,\n3,4"
response = client.post(
    "/api/v1/data/upload",
    files={"file": ("test.csv", content, "text/csv")}
)
print("Upload status:", response.status_code)
print("Upload response:", response.text)
