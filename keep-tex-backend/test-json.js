// Test script for JSON parsing
const testJson = '[{"taille":"XS","quantite":500}]';

try {
  const parsed = JSON.parse(testJson);
  console.log('Successfully parsed JSON:', parsed);
  console.log('First item taille:', parsed[0].taille);
  console.log('First item quantite:', parsed[0].quantite);
} catch (error) {
  console.error('Error parsing JSON:', error.message);
  console.error('Original string:', testJson);
}