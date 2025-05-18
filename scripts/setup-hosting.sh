#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Social Media Manager - Self-Hosting Setup${NC}\n"

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root (sudo)${NC}"
    exit 1
fi

# Function to check command success
check_success() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Success${NC}"
    else
        echo -e "${RED}✗ Failed${NC}"
        exit 1
    fi
}

echo -e "1. Updating system packages..."
apt update && apt upgrade -y
check_success

echo -e "\n2. Installing Docker and Docker Compose..."
apt install docker.io docker-compose -y
check_success

echo -e "\n3. Starting Docker service..."
systemctl start docker
systemctl enable docker
check_success

echo -e "\n4. Creating required directories..."
mkdir -p nginx/ssl
mkdir -p certbot/conf
mkdir -p certbot/www
check_success

echo -e "\n5. Setting up firewall..."
ufw allow 22
ufw allow 80
ufw allow 443
echo "y" | ufw enable
check_success

echo -e "\n6. Creating SSL renewal script..."
cat > ssl-renew.sh << 'EOF'
#!/bin/bash
docker-compose run certbot renew
docker-compose restart nginx
EOF
chmod +x ssl-renew.sh
check_success

echo -e "\n7. Setting up SSL renewal cron job..."
(crontab -l 2>/dev/null; echo "0 */12 * * * $(pwd)/ssl-renew.sh") | crontab -
check_success

echo -e "\n${BLUE}Please configure your domain in:${NC}"
echo "1. docker-compose.yml"
echo "2. nginx/conf.d/default.conf"

echo -e "\n${BLUE}Then run:${NC}"
echo "docker-compose up -d"

echo -e "\n${GREEN}Setup complete! 🚀${NC}"
