<#
.SYNOPSIS
    Script PowerShell pour tester la connexion à PostgreSQL sur un autre PC du réseau local
.DESCRIPTION
    Ce script permet de vérifier si PostgreSQL est accessible sur un PC distant (PC A)
    en utilisant la commande Test-NetConnection et en essayant de se connecter au port PostgreSQL
.NOTES
    Auteur: Assistant IA
    Date: $(Get-Date -Format "yyyy-MM-dd")
#>

# Configuration - MODIFIEZ CES VALEURS
$PC_A_IP = "192.168.1.X"  # Remplacez X par l'adresse IP du PC A
$POSTGRES_PORT = 5433     # Port PostgreSQL (vérifiez qu'il s'agit bien du port utilisé)

# Afficher les informations de connexion
Write-Host ""
Write-Host "Test de connexion PostgreSQL" -ForegroundColor Cyan
Write-Host "========================="  -ForegroundColor Cyan
Write-Host "Adresse IP du serveur PostgreSQL: $PC_A_IP" -ForegroundColor Yellow
Write-Host "Port PostgreSQL: $POSTGRES_PORT" -ForegroundColor Yellow
Write-Host ""

# Étape 1: Vérifier si l'hôte est accessible (ping)
Write-Host "Étape 1: Test de connectivité réseau (ping)..." -ForegroundColor Green
try {
    $pingResult = Test-Connection -ComputerName $PC_A_IP -Count 2 -Quiet
    if ($pingResult) {
        Write-Host "✅ Le PC A ($PC_A_IP) répond au ping." -ForegroundColor Green
    } else {
        Write-Host "❌ Le PC A ($PC_A_IP) ne répond pas au ping." -ForegroundColor Red
        Write-Host "   Vérifiez que le PC est allumé et connecté au réseau." -ForegroundColor Yellow
        Write-Host "   Note: Certains pare-feu peuvent bloquer les pings." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erreur lors du test de ping: $_" -ForegroundColor Red
}

# Étape 2: Vérifier si le port PostgreSQL est accessible
Write-Host ""
Write-Host "Étape 2: Test de connexion au port PostgreSQL..." -ForegroundColor Green
try {
    $portTest = Test-NetConnection -ComputerName $PC_A_IP -Port $POSTGRES_PORT -WarningAction SilentlyContinue
    
    if ($portTest.TcpTestSucceeded) {
        Write-Host "✅ Le port PostgreSQL ($POSTGRES_PORT) est accessible sur $PC_A_IP." -ForegroundColor Green
    } else {
        Write-Host "❌ Le port PostgreSQL ($POSTGRES_PORT) n'est pas accessible sur $PC_A_IP." -ForegroundColor Red
        Write-Host "   Causes possibles:" -ForegroundColor Yellow
        Write-Host "   1. PostgreSQL n'est pas démarré sur le PC A" -ForegroundColor Yellow
        Write-Host "   2. PostgreSQL n'est pas configuré pour écouter sur toutes les interfaces" -ForegroundColor Yellow
        Write-Host "   3. Le pare-feu bloque les connexions sur le port $POSTGRES_PORT" -ForegroundColor Yellow
        Write-Host "   4. Le port PostgreSQL configuré est incorrect" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erreur lors du test de port: $_" -ForegroundColor Red
}

# Étape 3: Conseils supplémentaires
Write-Host ""
Write-Host "Étapes suivantes:" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan

if ($portTest.TcpTestSucceeded) {
    Write-Host "1. Testez la connexion avec le script Node.js:" -ForegroundColor White
    Write-Host "   node test-pg-connection.js" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Si le test Node.js échoue, vérifiez:" -ForegroundColor White
    Write-Host "   - Les identifiants PostgreSQL (utilisateur/mot de passe)" -ForegroundColor Gray
    Write-Host "   - La configuration pg_hba.conf pour autoriser les connexions depuis $PC_A_IP" -ForegroundColor Gray
} else {
    Write-Host "1. Sur le PC A, vérifiez la configuration PostgreSQL:" -ForegroundColor White
    Write-Host "   - Dans postgresql.conf: listen_addresses = '*'" -ForegroundColor Gray
    Write-Host "   - Dans pg_hba.conf: ajoutez 'host all all 192.168.1.0/24 md5'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Vérifiez que le service PostgreSQL est démarré:" -ForegroundColor White
    Write-Host "   - Windows: Services > postgresql-x64-[version]" -ForegroundColor Gray
    Write-Host "   - Linux: sudo systemctl status postgresql" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Vérifiez la configuration du pare-feu:" -ForegroundColor White
    Write-Host "   - Windows: Pare-feu Windows > Règles de trafic entrant" -ForegroundColor Gray
    Write-Host "   - Linux: sudo ufw status" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Pour plus d'informations, consultez le fichier GUIDE-POSTGRESQL-RESEAU.md" -ForegroundColor Cyan
Write-Host ""