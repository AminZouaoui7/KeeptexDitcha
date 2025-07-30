const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    // Utiliser une URL MongoDB depuis les variables d'environnement ou une valeur par défaut
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/keeptex';
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;