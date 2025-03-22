@echo off
echo ===================================
echo Social Media Manager - Auto Setup
echo ===================================
echo.

REM Check for GitHub CLI
where gh >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing GitHub CLI...
    winget install --id GitHub.cli
)

REM Check for Docker
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing Docker Desktop...
    winget install -e --id Docker.DockerDesktop
)

echo Please login to GitHub...
gh auth login

echo.
echo Setting up project...
echo.

REM Create project directory
set PROJECT_DIR=%USERPROFILE%\social-media-manager
mkdir "%PROJECT_DIR%"
cd "%PROJECT_DIR%"

REM Clone repository
echo Cloning repository...
gh repo clone CrzyHAX91/social-media-manager . || git clone https://github.com/CrzyHAX91/social-media-manager.git .

REM Create necessary directories
mkdir nginx\ssl
mkdir certbot\conf
mkdir certbot\www

REM Start Docker services
echo Starting Docker services...
docker-compose up -d

echo.
echo ===================================
echo Setup Complete!
echo.
echo Next steps:
echo 1. Configure your domain in docker-compose.yml
echo 2. Configure your domain in nginx/conf.d/default.conf
echo 3. Run 'docker-compose up -d' to start services
echo ===================================

pause
