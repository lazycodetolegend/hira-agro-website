@echo off
title Hira Agro Industry - Localhost Launcher
color 0A

echo ============================================================
echo           HIRA AGRO INDUSTRY - LOCALHOST LAUNCHER
echo ============================================================
echo.

set "PROJECT_DIR=%~dp0"
if "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

echo [1/3] Starting Backend Server (Port 5000)...
cd /d "%PROJECT_DIR%\server"
start "Hira Agro - Backend (Port 5000)" cmd /k "npm start"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Server (Port 5173)...
cd /d "%PROJECT_DIR%\client"
start "Hira Agro - Frontend (Port 5173)" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ============================================================
echo   Application started!
echo     - Backend window: Express running on port 5000
echo     - Frontend window: Vite running on port 5173
echo     - Website URL: http://localhost:5173
echo   (Keep the two terminal windows running while using the site)
echo ============================================================
echo.
pause
