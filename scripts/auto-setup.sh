#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}===================================
Social Media Manager - Auto Setup
===================================${NC}\n"

# Check for GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "Installing GitHub CLI..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install gh
    else
        # Linux
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
        sudo apt update
        sudo apt install gh
    fi
fi

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install --cask docker
    else
        # Linux
        sudo apt update
        sudo apt install -y docker.io docker-compose
        sudo systemctl start docker
        sudo systemctl enable docker
    fi
fi

echo -e "\nPlease login to GitHub..."
gh auth login

echo -e "\nSetting up project..."

# Create project directory
PROJECT_DIR="$HOME/social-media-manager"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Clone repository
echo "Cloning repository..."
gh repo clone CrzyHAX91/social-media-manager . || git clone https://github.com/CrzyHAX91/social-media-manager.git .

# Create necessary directories
mkdir -p nginx/ssl
mkdir -p certbot/conf
mkdir -p certbot/www

# Set up firewall
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "Setting up firewall..."
    sudo ufw allow 22
    sudo ufw allow 80
    sudo ufw allow 443
    echo "y" | sudo ufw enable
fi

# Start Docker services
echo "Starting Docker services..."
docker-compose up -d

echo -e "\n${GREEN}===================================
Setup Complete!

Next steps:
1. Configure your domain in docker-compose.yml
2. Configure your domain in nginx/conf.d/default.conf
3. Run 'docker-compose up -d' to start services
===================================${NC}"

read -p "Press Enter to continue..."
