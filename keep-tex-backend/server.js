const express = require('express');
const sequelize = require('./sequelize');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
// Configuration CORS simple
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Connect to PostgreSQL using Sequelize
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected');
    // Synchronize all models after connection is established
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log('All models synchronized'))
  .catch(err => console.error('Database error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});