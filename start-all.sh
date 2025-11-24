#!/bin/bash

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Authentication System...${NC}"
echo -e "${GREEN}=================================${NC}"
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start External PIN API
echo -e "${CYAN}1. Starting External PIN API (Port 3001)...${NC}"
cd "$SCRIPT_DIR/external-pin-api" && npm start &
sleep 2

# Start Backend API
echo -e "${CYAN}2. Starting Backend API (Port 3000)...${NC}"
cd "$SCRIPT_DIR/backend" && npm start &
sleep 2

# Start Frontend
echo -e "${CYAN}3. Starting Frontend (Port 5173)...${NC}"
cd "$SCRIPT_DIR/vite-project" && npm run dev &

echo ""
echo -e "${GREEN}=================================${NC}"
echo -e "${GREEN}All services started!${NC}"
echo ""
echo -e "${YELLOW}External PIN API: http://localhost:3001${NC}"
echo -e "${YELLOW}Backend API:      http://localhost:3000${NC}"
echo -e "${YELLOW}Frontend:         http://localhost:5173${NC}"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for all background processes
wait
