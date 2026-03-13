import os

class Settings:
    PROJECT_NAME: str = "PrediqX"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    # Use /tmp for serverless environments like Vercel
    UPLOAD_DIR: str = "/tmp/uploads"

    def __init__(self):
        if not os.path.exists(self.UPLOAD_DIR):
            os.makedirs(self.UPLOAD_DIR, exist_ok=True)

settings = Settings()
