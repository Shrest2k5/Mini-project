@echo off
echo Starting Garbage Reporter Platform...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && node index.js"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd client && npm start"

echo.
echo ========================================
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo ========================================
echo.
echo Both servers are starting in separate windows.
echo Close those windows to stop the servers.
pause
