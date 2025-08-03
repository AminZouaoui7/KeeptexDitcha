@echo off
echo Test des nouveaux etats de commande

REM Remplacez ces valeurs par les votres
set ID_COMMANDE=1
set TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU0MmI5YTBkLTk4YzMtNDQzNi1iMDRmLTJlMzQ3YjRiM2RkZCIsImlhdCI6MTY4NTk3NTY1OCwiZXhwIjoxNjg4NTY3NjU4fQ.QMKdX3CtwQIoqca5UM7y3LFLWe_Z8Lw-QjLLzSwJQOE

REM Mettre a jour l'etat a "livree"
echo.
echo Mise a jour de l'etat a "livree"
curl -X PUT http://localhost:5000/api/commandes/%ID_COMMANDE%/etat -H "Content-Type: application/json" -H "Authorization: Bearer %TOKEN%" -d "{\"etat\": \"livree\"}"

REM Attendre 2 secondes
timeout /t 2 /nobreak > nul

REM Verifier les details de la commande
echo.
echo.
echo Verification des details de la commande
curl -X GET http://localhost:5000/api/commandes/%ID_COMMANDE% -H "Authorization: Bearer %TOKEN%"

REM Attendre 2 secondes
timeout /t 2 /nobreak > nul

REM Mettre a jour l'etat a "annulee"
echo.
echo.
echo Mise a jour de l'etat a "annulee"
curl -X PUT http://localhost:5000/api/commandes/%ID_COMMANDE%/etat -H "Content-Type: application/json" -H "Authorization: Bearer %TOKEN%" -d "{\"etat\": \"annulee\"}"

REM Attendre 2 secondes
timeout /t 2 /nobreak > nul

REM Verifier les details de la commande
echo.
echo.
echo Verification des details de la commande
curl -X GET http://localhost:5000/api/commandes/%ID_COMMANDE% -H "Authorization: Bearer %TOKEN%"

echo.
echo.
echo Test termine
pause