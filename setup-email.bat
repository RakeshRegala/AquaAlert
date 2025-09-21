@echo off
echo ========================================
echo   Health Sense Email Setup
echo ========================================
echo.

echo Step 1: Creating server .env file...
echo GMAIL_USER=rakeshregala3@gmail.com > server\.env
echo GMAIL_APP_PASSWORD=your-16-character-app-password-here >> server\.env
echo PORT=3001 >> server\.env

echo.
echo Step 2: Creating frontend .env file...
echo VITE_GMAIL_USER=rakeshregala3@gmail.com > .env
echo VITE_GMAIL_APP_PASSWORD=your-16-character-app-password-here >> .env
echo VITE_GOVERNMENT_EMAIL=rakeshregala3@gmail.com >> .env
echo VITE_GOVERNMENT_NAME=Rakesh >> .env

echo.
echo ========================================
echo   IMPORTANT: Get Your Gmail App Password
echo ========================================
echo.
echo 1. Go to: https://myaccount.google.com/apppasswords
echo 2. Generate a new App Password for "Mail"
echo 3. Copy the 16-character password
echo 4. Replace "your-16-character-app-password-here" in both .env files
echo.
echo ========================================
echo   Starting Email Server
echo ========================================
echo.

cd server
node email-api.js
