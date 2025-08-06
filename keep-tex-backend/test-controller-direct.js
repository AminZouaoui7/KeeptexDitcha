const axios = require('axios');

async function testControllerDirect() {
  try {
    const testData = {
      nom: 'Test Article',
      categorie: 'Test',
      couleur: 'Rouge',
      unite: 'mètre',
      quantite: 22,
      seuil: 10
    };

    console.log('Sending request to http://localhost:5000/api/articles');
    console.log('Request data:', testData);
    console.log('Data types:', {
      quantite: typeof testData.quantite,
      seuil: typeof testData.seuil
    });

    const response = await axios.post('http://localhost:5000/api/articles', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Success! Response:', response.data);
  } catch (error) {
    console.error('Error response:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    if (error.response?.data?.message) {
      console.error('Error message:', error.response.data.message);
    }
  }
}

testControllerDirect();