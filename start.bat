@echo off
title Hira Agro Industry - Localhost Server
color 0A

echo ============================================================
echo           HIRA AGRO INDUSTRY - LOCALHOST LAUNCHER
echo ============================================================
echo.

cd /d "%~dp0"

if not exist "dev.js" (
  echo [ERROR] Cannot find dev.js in "%~dp0"
  pause
  exit /b 1
)

echo Starting servers... All logs will appear in this window:
echo.

node dev.js

echo.
echo ============================================================
echo  Server process ended.
echo ============================================================
pause
