@echo off
echo ========================================
echo   Complete Health Sense Setup
echo ========================================
echo.

echo Step 1: Creating server .env file...
echo GMAIL_USER=rakeshregala3@gmail.com > server\.env
echo GMAIL_APP_PASSWORD=pzje dimu qdwo gkjw >> server\.env
echo GOVERNMENT_EMAIL=rakeshregala3@gmail.com >> server\.env
echo GOVERNMENT_NAME=Rakesh >> server\.env
echo PORT=3001 >> server\.env

echo.
echo Step 2: Adding Gmail config to root .env...
echo VITE_GMAIL_USER=rakeshregala3@gmail.com >> .env
echo VITE_GMAIL_APP_PASSWORD=pzje dimu qdwo gkjw >> .env
echo VITE_GOVERNMENT_EMAIL=rakeshregala3@gmail.com >> .env
echo VITE_GOVERNMENT_NAME=Rakesh >> .env

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Now you can:
echo 1. Start the email server: cd server ^&^& node real-time-alerts.js
echo 2. Start the frontend: npm run dev
echo.
echo Both should work without errors now!
echo.
pause
