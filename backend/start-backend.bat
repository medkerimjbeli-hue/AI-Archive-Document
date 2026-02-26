@echo off
REM Backend Quick Start Script for Windows
REM This script starts the AI-DOC-SYS backend server

echo.
echo ========================================
echo AI-DOC-SYS Backend - Quick Start
echo ========================================
echo.

echo Checking for Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking for dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Checking MongoDB connection...
echo Make sure MongoDB is running or configure MongoDB Atlas in .env file
echo.

echo Starting backend server...
echo.
echo Server will run on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

call npm start

pause
