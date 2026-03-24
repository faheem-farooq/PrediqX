import sys
import os

# Temporary isolation for build debugging
# sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from fastapi import FastAPI

app = FastAPI()

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "source": "isolated api/index.py"}
