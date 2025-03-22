#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Creating backup of Social Media Manager...${NC}"

# Get timestamp for backup name
timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
backup_name="social-media-manager-backup_${timestamp}.zip"

# Create backup directory
backup_dir="/mnt/d/Social_media_manager-v1"
mkdir -p "$backup_dir/backups"

# Create backup
zip -r "$backup_dir/backups/$backup_name" . \
    -x "*.git*" \
    -x "node_modules/*" \
    -x "*.zip"

echo -e "\n${GREEN}Backup created successfully at: $backup_dir/backups/$backup_name${NC}"

# If not on Windows, provide alternative instructions
if [ ! -d "/mnt/d" ]; then
    echo -e "\n${BLUE}Note: If you're not on Windows, please move the backup file to D:\Social_media_manager-v1\backups:${NC}"
    echo "mv $backup_name /path/to/D/Social_media_manager-v1/backups/"
fi

read -p "Press Enter to continue..."
