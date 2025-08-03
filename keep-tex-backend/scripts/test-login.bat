@echo off
echo Testing login API with curl...
echo.

echo 1. Testing regular login endpoint:
curl -X POST http://192.168.1.128:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\": \"admin@keeptex.fr\", \"password\": \"test1234\"}"
echo.
echo.

echo 2. Testing test-login endpoint:
curl -X POST http://192.168.1.128:5000/api/auth/test-login -H "Content-Type: application/json" -d "{\"email\": \"admin@keeptex.fr\", \"password\": \"test1234\"}"
echo.
echo.

pause