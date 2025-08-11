#!/usr/bin/env node

/**
 * Script de test performance pour l'endpoint /api/attendance/stats
 * Vérifie le timeout, les réponses rapides et la gestion d'erreur
 */

const axios = require('axios');
const colors = require('colors');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Remplacer par votre token JWT

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  },
  timeout: 6000 // Timeout client > serveur (5s)
});

// Fonction utilitaire pour formater le temps
const formatTime = (ms) => {
  if (ms < 1000) return `${ms.toFixed(0)}ms`.green;
  if (ms < 2000) return `${ms.toFixed(0)}ms`.yellow;
  return `${ms.toFixed(0)}ms`.red;
};

// Test 1: Requête valide avec mesure de performance
async function testValidRequest() {
  console.log('\n🟢 Test 1: Requête valide (2024-01)');
  try {
    const start = Date.now();
    const response = await api.get('/api/attendance/stats?month=2024-01');
    const duration = Date.now() - start;
    
    console.log(`✅ Status: ${response.status}`.green);
    console.log(`⏱️  Durée: ${formatTime(duration)}`);
    console.log(`📊 Données: ${response.data.data.length} employés`);
    console.log('Réponse:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.log('❌ Erreur:', error.message.red);
    return null;
  }
}

// Test 2: Mois sans données
async function testEmptyData() {
  console.log('\n🟡 Test 2: Mois sans données (2025-01)');
  try {
    const response = await api.get('/api/attendance/stats?month=2025-01');
    
    console.log(`✅ Status: ${response.status}`.green);
    console.log(`📊 Données: ${response.data.data.length} (devrait être 0)`);
    
    if (response.data.data.length === 0 && response.data.success === true) {
      console.log('✅ Comportement correct - tableau vide retourné'.green);
    } else {
      console.log('❌ Comportement inattendu'.red);
    }
    
    return response.data;
  } catch (error) {
    console.log('❌ Erreur:', error.message.red);
    return null;
  }
}

// Test 3: Format de mois invalide
async function testInvalidFormat() {
  console.log('\n🔴 Test 3: Format de mois invalide');
  try {
    const response = await api.get('/api/attendance/stats?month=invalid');
    console.log('❌ Ne devrait pas arriver - validation côté serveur'.red);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log(`✅ Validation correcte: ${error.response.data.message}`.green);
    } else {
      console.log('❌ Erreur inattendue:', error.message.red);
    }
  }
}

// Test 4: Paramètre manquant
async function testMissingParameter() {
  console.log('\n🔴 Test 4: Paramètre manquant');
  try {
    const response = await api.get('/api/attendance/stats');
    console.log('❌ Ne devrait pas arriver - validation requise'.red);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log(`✅ Validation correcte: ${error.response.data.message}`.green);
    } else {
      console.log('❌ Erreur inattendue:', error.message.red);
    }
  }
}

// Test 5: Test de performance multiple
async function testPerformance() {
  console.log('\n⚡ Test 5: Test de performance multiple');
  const months = ['2024-01', '2024-02', '2024-03', '2024-04'];
  const results = [];
  
  for (const month of months) {
    try {
      const start = Date.now();
      const response = await api.get(`/api/attendance/stats?month=${month}`);
      const duration = Date.now() - start;
      
      results.push({ month, duration, count: response.data.data.length });
    } catch (error) {
      results.push({ month, error: error.message });
    }
  }
  
  console.log('\n📊 Résultats performance:');
  results.forEach(r => {
    if (r.error) {
      console.log(`${r.month}: ❌ ${r.error}`.red);
    } else {
      console.log(`${r.month}: ${formatTime(r.duration)} (${r.count} employés)`);
    }
  });
  
  const avgTime = results.filter(r => !r.error).reduce((sum, r) => sum + r.duration, 0) / results.filter(r => !r.error).length;
  console.log(`\n📈 Temps moyen: ${formatTime(avgTime)}`);
}

// Test 6: Test timeout (simulation)
async function testTimeout() {
  console.log('\n⏰ Test 6: Test de timeout (simulation)');
  
  // Créer une requête avec un timeout très court pour tester
  const shortTimeoutApi = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    timeout: 100 // 100ms - devrait déclencher le timeout
  });
  
  try {
    await shortTimeoutApi.get('/api/attendance/stats?month=2024-01');
    console.log('❌ Timeout non déclenché'.red);
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.log('✅ Timeout client déclenché (comportement attendu)'.yellow);
    } else {
      console.log('❌ Erreur inattendue:', error.message.red);
    }
  }
}

// Script principal
async function runTests() {
  console.log('🚀 Test de performance - Endpoint /api/attendance/stats'.cyan.bold);
  console.log('='.repeat(60));
  
  try {
    await testValidRequest();
    await testEmptyData();
    await testInvalidFormat();
    await testMissingParameter();
    await testPerformance();
    await testTimeout();
    
    console.log('\n✅ Tous les tests terminés'.green.bold);
  } catch (error) {
    console.error('❌ Erreur globale:', error.message.red);
  }
}

// Commandes curl rapides pour test manuel
console.log('\n📋 Commandes curl pour test rapide:');
console.log('Valid request:'.gray);
console.log(`curl -X GET "${BASE_URL}/api/attendance/stats?month=2024-01" -H "Authorization: Bearer YOUR_TOKEN"`.cyan);
console.log('Empty data:'.gray);
console.log(`curl -X GET "${BASE_URL}/api/attendance/stats?month=2025-01" -H "Authorization: Bearer YOUR_TOKEN"`.cyan);
console.log('Invalid format:'.gray);
console.log(`curl -X GET "${BASE_URL}/api/attendance/stats?month=invalid" -H "Authorization: Bearer YOUR_TOKEN"`.cyan);

// Exécution
if (require.main === module) {
  runTests();
}

module.exports = { runTests };