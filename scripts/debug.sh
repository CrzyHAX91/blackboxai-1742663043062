#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Starting Debug Process...${NC}\n"

# Function to check if a command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        return 1
    else
        echo -e "${GREEN}✓ $1 is installed${NC}"
        return 0
    fi
}

# Function to check if a port is in use and kill the process if needed
check_and_free_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${BLUE}Port $1 is in use. Attempting to free it...${NC}"
        lsof -ti:$1 | xargs kill -9
        sleep 2
        if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
            echo -e "${RED}❌ Failed to free port $1${NC}"
            return 1
        else
            echo -e "${GREEN}✓ Port $1 freed successfully${NC}"
            return 0
        fi
    else
        echo -e "${GREEN}✓ Port $1 is available${NC}"
        return 0
    fi
}

# Function to check if a file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓ $1 exists${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 is missing${NC}"
        return 1
    fi
}

echo "1. Checking Dependencies..."
check_command "node"
check_command "npm"
check_command "python3"
check_command "docker"
check_command "docker-compose"

echo -e "\n2. Checking Port Availability..."
check_and_free_port 8000

echo -e "\n3. Checking Critical Files..."
check_file "package.json"
check_file "tailwind.config.js"
check_file "styles/input.css"
check_file "styles/output.css"
check_file "index.html"
check_file "pages/dashboard.html"
check_file "pages/deploy-guide.html"

echo -e "\n4. Checking Node Modules..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ node_modules exists${NC}"
    echo "Verifying node_modules integrity..."
    npm list --depth=0
else
    echo -e "${RED}❌ node_modules is missing. Running npm install...${NC}"
    npm install
fi

echo -e "\n5. Building CSS..."
npm run build

echo -e "\n6. Checking Docker Configuration..."
if docker-compose config >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Docker Compose configuration is valid${NC}"
else
    echo -e "${RED}❌ Docker Compose configuration has errors${NC}"
fi

echo -e "\n7. Testing Server..."
# Kill any existing Python server
pkill -f "python3 -m http.server 8000" >/dev/null 2>&1

# Start server in background
python3 -m http.server 8000 &
SERVER_PID=$!
echo "Started test server with PID: $SERVER_PID"

# Wait for server to start
sleep 2

# Test server response
if curl -s http://localhost:8000 >/dev/null; then
    echo -e "${GREEN}✓ Server is responding${NC}"
else
    echo -e "${RED}❌ Server is not responding${NC}"
fi

# Cleanup
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null
pkill -f "python3 -m http.server 8000" >/dev/null 2>&1

echo -e "\n8. Checking Git Status..."
if [ -d ".git" ]; then
    if git status &>/dev/null; then
        echo -e "${GREEN}✓ Git repository is healthy${NC}"
        git status --porcelain
    else
        echo -e "${RED}❌ Git repository has issues${NC}"
    fi
else
    echo -e "${BLUE}ℹ No Git repository found${NC}"
fi

echo -e "\n${BLUE}Debug Process Complete!${NC}"
echo "Check the results above for any issues that need to be addressed."
