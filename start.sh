#!/bin/bash

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting PrediqX Local Hosting Setup...${NC}"

# 1. Cleanup existing processes
echo -e "${BLUE}Cleaning up ports 8000 and 5173...${NC}"
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

# 2. Start Backend
echo -e "${GREEN}Setting up Backend...${NC}"
cd backend

# Ensure dependencies are available (using local vendor if needed)
export PYTHONPATH=$PYTHONPATH:$(pwd)/vendor

# Check if google-generativeai is importable
if ! python3 -c "import google.generativeai" 2>/dev/null; then
    echo -e "${RED}Dependencies missing. Installing to local vendor directory...${NC}"
    pip3 install -t vendor -r requirements.txt
fi

# Start Backend in background
echo -e "${GREEN}Launching Backend Server...${NC}"
# Run uvicorn in background, redirecting logs to file
nohup python3 -m uvicorn app.main:app --reload --port 8000 > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait for backend to be ready
echo "Waiting for backend to initialize..."
sleep 5

cd ..

# 3. Start Frontend
echo -e "${GREEN}Setting up Frontend...${NC}"

# Check for node_modules permissions issue
if [ ! -w "node_modules" ] && [ -d "node_modules" ]; then
    echo -e "${RED}Warning: node_modules is not writable. Attempting to fix permissions...${NC}"
    echo "Please enter your password if prompted:"
    sudo chown -R $USER node_modules
fi

# Install dependencies if missing
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    npm install
fi

echo -e "${GREEN}Launching Frontend Server...${NC}"
echo -e "${BLUE}The application should open in your browser shortly...${NC}"
echo -e "${BLUE}Backend Logs: backend/backend.log${NC}"

# Start frontend (this will stay in foreground)
npm run dev
