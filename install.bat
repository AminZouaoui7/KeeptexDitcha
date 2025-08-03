@echo off
echo KeepTex Installation Script
echo ============================
echo.

echo This script will install all dependencies for the KeepTex project.
echo.

echo 1. Installing root dependencies...
echo ============================
call npm install
echo.

echo 2. Installing backend dependencies...
echo ============================
cd keep-tex-backend
call npm install
cd ..
echo.

echo 3. Installing frontend dependencies...
echo ============================
cd keep-tex-frontend
call npm install
cd ..
echo.

echo Installation completed successfully!
echo.
echo You can now run the application using the start-dev.bat script.
echo.

pause