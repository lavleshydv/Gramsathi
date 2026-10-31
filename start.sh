#!/usr/bin/env bash
# GramSathi AI — Full-Stack Application Launcher (Linux / macOS)

echo "===================================================================="
echo "🌾 Starting GramSathi AI (Backend FastAPI :8000 + Frontend Web :3000)"
echo "===================================================================="

# 1. Start FastAPI Backend in background
echo "[1/2] Launching Evidence Intelligence Backend at http://127.0.0.1:8000 ..."
(cd backend && PYTHONPATH=. python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload) &
BACKEND_PID=$!

# 2. Start Next.js Frontend
echo "[2/2] Launching Next.js Web Experience at http://localhost:3000 ..."
(cd apps/web && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "===================================================================="
echo "[OK] Both servers are starting up!"
echo "  - Backend Swagger Docs: http://127.0.0.1:8000/docs"
echo "  - Frontend Website:     http://localhost:3000"
echo "===================================================================="

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait

