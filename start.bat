@echo off
echo ========================================================
echo   Starting DryFruitKart (RCB 2026 Edition)
echo   Connected to Neon PostgreSQL Cloud Database
echo ========================================================

echo Starting Backend Server on http://localhost:5000 ...
start "DryFruitKart Backend" cmd /k "cd /d %~dp0server && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting Frontend Client on http://localhost:5173 ...
start "DryFruitKart Frontend" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo Both servers are starting up!
echo Open your browser at: http://localhost:5173
pause
