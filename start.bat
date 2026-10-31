@echo off
title GramSathi AI — Full-Stack Application Launcher
echo ====================================================================
echo 🌾 Starting GramSathi AI (Backend FastAPI :8000 + Frontend Web :3000)
echo ====================================================================
echo.

:: 1. Launch FastAPI Backend
echo [1/2] Launching Evidence Intelligence Backend at http://127.0.0.1:8000 ...
start "GramSathi AI Backend (:8000)" cmd /k "cd backend && set PYTHONPATH=. && C:\Users\HP\AppData\Local\Programs\Python\Python312\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

:: 2. Launch Next.js Web Experience
echo [2/2] Launching Next.js Web Experience at http://localhost:3000 ...
start "GramSathi AI Web (:3000)" cmd /k "cd apps\web && node ..\..\node_modules\next\dist\bin\next dev -p 3000"

echo.
echo ====================================================================
echo [OK] Both servers are starting up!
echo   - Backend Swagger Docs: http://127.0.0.1:8000/docs
echo   - Frontend Website:     http://localhost:3000
echo ====================================================================

