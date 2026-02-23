#!/bin/bash

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting PrediqX (Clean Mode)...${NC}"

# 1. Start Backend (Port 8000)
echo -e "${GREEN}Starting Backend...${NC}"
cd backend
# Ensure dependencies
export PYTHONPATH=$PYTHONPATH:$(pwd)/vendor
if ! python3 -c "import google.generativeai" 2>/dev/null; then
    echo "Installing backend dependencies..."
    pip3 install -t vendor -r requirements.txt
fi
nohup python3 -m uvicorn app.main:app --reload --port 8000 > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend running (PID: $BACKEND_PID)"
sleep 3
cd ..

# 2. Start Frontend (Port 5175 from frontend_copy)
echo -e "${GREEN}Starting Frontend (Port 5175)...${NC}"
cd frontend_copy
echo -e "${BLUE}Opening application in browser...${NC}"
npm run dev -- --port 5175
