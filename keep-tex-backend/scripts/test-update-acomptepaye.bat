@echo off
echo Test de la mise a jour du statut de paiement de l'acompte

REM Remplacez ces valeurs par les votres
set ID_COMMANDE=1
set TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU0MmI5YTBkLTk4YzMtNDQzNi1iMDRmLTJlMzQ3YjRiM2RkZCIsImlhdCI6MTY4NTk3NTY1OCwiZXhwIjoxNjg4NTY3NjU4fQ.QMKdX3CtwQIoqca5UM7y3LFLWe_Z8Lw-QjLLzSwJQOE

REM Mettre a jour le statut de paiement de l'acompte a true
echo.
echo Mise a jour du statut de paiement de l'acompte a TRUE
curl -X PUT http://localhost:5000/api/commandes/%ID_COMMANDE%/acomptepaye -H "Content-Type: application/json" -H "Authorization: Bearer %TOKEN%" -d "{\"acomptepaye\": true}"

REM Attendre 2 secondes
timeout /t 2 /nobreak > nul

REM Mettre a jour le statut de paiement de l'acompte a false
echo.
echo.
echo Mise a jour du statut de paiement de l'acompte a FALSE
curl -X PUT http://localhost:5000/api/commandes/%ID_COMMANDE%/acomptepaye -H "Content-Type: application/json" -H "Authorization: Bearer %TOKEN%" -d "{\"acomptepaye\": false}"

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