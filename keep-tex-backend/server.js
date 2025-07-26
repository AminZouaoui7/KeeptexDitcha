const express = require('express');
const sequelize = require('./sequelize');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Keep-Tex API' });
});

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/commandes', require('./routes/commandeRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/feedbacks', require('./routes/feedbackRoutes'));

// Serve static files (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}

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