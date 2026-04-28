import asyncio
from fastapi.testclient import TestClient
from backend.app.main import app
import io

client = TestClient(app)
content = b"A,B\n1,2\n3,4"
response = client.post(
    "/api/v1/data/upload",
    files={"file": ("test.csv", content, "text/csv")}
)
print("Upload status:", response.status_code)
print("Upload response:", response.json())
