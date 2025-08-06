const http = require('http');

const data = JSON.stringify({
  nom: "Test Article",
  categorie: "Test",
  couleur: "Rouge", 
  unite: "mètre",
  quantite: 22,
  seuil: 10
});

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

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  
  let responseBody = '';
  res.on('data', (chunk) => {
    responseBody += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', responseBody);
    console.log('Sent data:', JSON.parse(data));
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

console.log('Sending data:', JSON.parse(data));
req.write(data);
req.end();