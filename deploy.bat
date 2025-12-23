@echo off
echo ========================================
echo Food Delivery System - Production Deploy
echo ========================================
echo.

REM Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed!
    exit /b 1
)

echo Step 1: Building Docker images...
docker-compose -f docker-compose.prod.yml build
if errorlevel 1 (
    echo ERROR: Build failed!
    exit /b 1
)

echo.
echo Step 2: Stopping old containers...
docker-compose -f docker-compose.prod.yml down

echo.
echo Step 3: Starting new containers...
docker-compose -f docker-compose.prod.yml up -d
if errorlevel 1 (
    echo ERROR: Deployment failed!
    exit /b 1
)

echo.
echo ========================================
echo DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Access Points:
echo - Frontend:  http://localhost:80
echo - Backend:   http://localhost:8080
echo.
echo View logs: docker-compose -f docker-compose.prod.yml logs -f
echo Stop all:  docker-compose -f docker-compose.prod.yml down
echo.

docker-compose -f docker-compose.prod.yml ps

pause
