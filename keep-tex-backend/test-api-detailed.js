const http = require('http');

const testData = {
  nom: "Test Article",
  categorie: "Test", 
  couleur: "Rouge",
  unite: "mètre",
  quantite: 22,
  seuil: 10
};

const data = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/articles',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('=== API Test ===');
console.log('Sending POST request to:', `http://${options.hostname}:${options.port}${options.path}`);
console.log('Request body:', testData);
console.log('Content-Type:', options.headers['Content-Type']);

const req = http.request(options, (res) => {
  console.log('\n=== Response ===');
  console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
  console.log('Headers:', res.headers);
  
  let responseBody = '';
  res.on('data', (chunk) => {
    responseBody += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', responseBody);
    
    try {
      const parsed = JSON.parse(responseBody);
      console.log('Parsed response:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Raw response:', responseBody);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.write(data);
req.end();