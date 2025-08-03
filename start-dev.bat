@echo off
echo KeepTex Development Environment

echo.
echo Choose an option:
echo 1. Start development servers
echo 2. Initialize database and start servers
echo 3. Exit

set /p option=Enter option (1-3): 

if "%option%"=="1" goto start_servers
if "%option%"=="2" goto init_database
if "%option%"=="3" goto end

echo Invalid option. Please try again.
goto end

:init_database
echo.
echo Initializing database...
cd keep-tex-backend
node init-database.js
cd ..
echo Database initialized successfully!
echo.
goto start_servers

:start_servers
echo.
echo Starting Backend Server...
start cmd /k "cd keep-tex-backend && npm run dev"

echo.
echo Starting Frontend Server...
start cmd /k "cd keep-tex-frontend && npm start"

echo.
echo KeepTex Development Environment is starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window (servers will continue running).
pause > nul
goto end

:end
echo Exiting...