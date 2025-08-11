#!/usr/bin/env node

/**
 * Test rapide pour vérifier que l'endpoint /api/attendance/stats fonctionne
 * Utilise fetch avec un timeout court pour diagnostiquer le problème
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Remplacer par votre token JWT

async function testEndpoint() {
  console.log('🧪 Test rapide de l\'endpoint /api/attendance/stats');
  console.log('='.repeat(50));

  const url = `${BASE_URL}/api/attendance/stats?month=2024-01`;
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/attendance/stats?month=2024-01',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Status: ${res.statusCode}`);
        try {
          const response = JSON.parse(data);
          console.log('📊 Réponse:', JSON.stringify(response, null, 2));
          resolve(response);
        } catch (e) {
          console.log('📄 Données brutes:', data);
          resolve(data);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Erreur:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.log('⏰ Timeout détecté');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.setTimeout(10000); // 10 secondes timeout
    req.end();
  });
}

// Test avec curl
console.log('\n📋 Commandes curl pour test rapide:');
console.log('Test 1 - Requête valide:');
console.log(`curl -X GET "${BASE_URL}/api/attendance/stats?month=2024-01" -H "Authorization: Bearer YOUR_TOKEN" -w "\\nTemps: %{time_total}s\\n"`);
console.log('\nTest 2 - Format invalide:');
console.log(`curl -X GET "${BASE_URL}/api/attendance/stats?month=invalid" -H "Authorization: Bearer YOUR_TOKEN"`);
console.log('\nTest 3 - Mois sans données:');
console.log(`curl -X GET "${BASE_URL}/api/attendance/stats?month=2025-01" -H "Authorization: Bearer YOUR_TOKEN"`);

// Exécution
if (require.main === module) {
  testEndpoint().catch(console.error);
}

module.exports = { testEndpoint };