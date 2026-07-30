@echo off
title URITOMO - Social Media App
cd /d "%~dp0backend"

echo ============================================
echo   URITOMO - Mini Social Media App
echo ============================================
echo.
echo [*] Installing dependencies (if needed)...
call npm install --silent 2>nul

echo [*] Setting up database with sample data...
call node seed.js

echo.
echo [*] Starting server...
echo [*] Open http://localhost:3001 in your browser
echo.
start http://localhost:3001
node server.js

pause

