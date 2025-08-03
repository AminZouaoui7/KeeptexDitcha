@echo off
echo Test de la route de mise à jour d'état de commande

REM Remplacez ces valeurs par vos propres données
set TOKEN=votre_token_jwt_ici
set COMMANDE_ID=1

echo.
echo 1. Test de la mise à jour de l'état d'une commande (PUT /api/commandes/%COMMANDE_ID%/etat)
echo.

curl -X PUT http://localhost:5000/api/commandes/%COMMANDE_ID%/etat ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"etat\": \"confection\"}" ^
  -v

echo.
echo Test terminé
echo.

pause