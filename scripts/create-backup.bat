@echo off
echo Creating backup of Social Media Manager...

REM Get current date and time for backup name
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "Sec=%dt:~12,2%"

set "timestamp=%YYYY%-%MM%-%DD%_%HH%-%Min%-%Sec%"
set "backup_name=social-media-manager-backup_%timestamp%.zip"

REM Create backup directories if they don't exist
if not exist "D:\Social_media_manager-v1" mkdir "D:\Social_media_manager-v1"
if not exist "D:\Social_media_manager-v1\backups" mkdir "D:\Social_media_manager-v1\backups"

REM Create zip file using PowerShell
powershell Compress-Archive -Path ".\*" -DestinationPath "D:\Social_media_manager-v1\backups\%backup_name%" -Force

echo.
echo Backup created successfully at: D:\Social_media_manager-v1\backups\%backup_name%
echo.
pause
