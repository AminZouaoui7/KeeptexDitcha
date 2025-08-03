const express = require('express');
const sequelize = require('./sequelize');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
// Configuration CORS avancée pour permettre les appels depuis React et Flutter Web
app.use(cors({
  origin: '*', // Permet l'accès depuis n'importe quelle origine
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de débogage pour voir le contenu de req.body et les headers
app.use((req, res, next) => {
  console.log('DEBUG REQ.BODY:', req.body);
  console.log('DEBUG REQ.BODY TYPE:', typeof req.body);
  console.log('DEBUG REQ.HEADERS:', req.headers);
  console.log('DEBUG REQ.METHOD:', req.method);
  console.log('DEBUG REQ.URL:', req.url);
  
  // Vérifier si le body est null ou undefined
  if (req.body === null || req.body === undefined) {
    console.log('DEBUG: req.body is null or undefined');
    // Initialiser req.body comme un objet vide si null ou undefined
    req.body = {};
  }
  
  next();
});

// Middleware de journalisation détaillé pour toutes les requêtes
app.use((req, res, next) => {
  console.log('------------------------------------------------------------');
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  if (req.method !== 'GET') {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  
  // Intercepter la réponse pour journaliser le statut
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`Response status: ${res.statusCode}`);
    console.log('------------------------------------------------------------');
    return originalSend.call(this, body);
  };
  
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Keep-Tex API' });
});

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
// Utiliser les routes PostgreSQL pour le contact au lieu de MongoDB
app.use('/api/contact', require('./routes/contactRoutesPg'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/commandes', require('./routes/commandeRoutes'));
app.use('/api/commande-tailles', require('./routes/commandeTailleRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/feedbacks', require('./routes/feedbackRoutes'));

// Serve static files (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Connect to PostgreSQL using Sequelize with enhanced error handling
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
    
    // Vérifier la connexion en exécutant une requête simple
    const [result] = await sequelize.query('SELECT NOW() as current_time');
    console.log(`✅ Database server time: ${result[0].current_time}`);
    
    // Synchronize all models after connection is established
    await sequelize.sync({ alter: true });
    console.log('✅ All models synchronized successfully');
    
    return true;
  } catch (err) {
    console.error('❌ Database connection error:', err);
    console.error('❌ Please check your PostgreSQL connection settings in .env file');
    console.error(`❌ Current connection string: ${process.env.POSTGRES_URI.replace(/:\/\/.*:(.*)@/, '://[username]:[hidden]@')}`);
    
    // En mode développement, on continue l'exécution même si la DB n'est pas connectée
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Application stopping due to database connection failure in production mode');
      process.exit(1);
    }
    
    return false;
  }
};

// Exécuter la connexion à la base de données
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Écoute sur toutes les interfaces
app.listen(PORT, HOST, () => {
  // Afficher l'adresse IP locale pour faciliter la connexion
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  const localIPs = [];
  
  // Récupérer toutes les adresses IP locales
  Object.keys(networkInterfaces).forEach(interfaceName => {
    const interfaces = networkInterfaces[interfaceName];
    interfaces.forEach(iface => {
      // Ignorer les adresses IPv6 et les interfaces loopback
      if (iface.family === 'IPv4' && !iface.internal) {
        localIPs.push(iface.address);
      }
    });
  });
  
  console.log(`Server running on port ${PORT}`);
  console.log(`Available on:`);
  console.log(`- http://localhost:${PORT}`);
  localIPs.forEach(ip => {
    console.log(`- http://${ip}:${PORT}`);
  });
});