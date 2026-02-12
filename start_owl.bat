@echo off
echo Starting Smart Owl Platform...

:: Start ML Service
start "ML Service" cmd /k "cd ml_service && python app.py"

:: Start Backend Server
start "Backend Server" cmd /k "cd server && node index.js"

:: Start Frontend Client
start "Frontend Client" cmd /k "cd client && npm run dev"

echo All services started!
echo Access the dashboard at http://localhost:5173
pause
