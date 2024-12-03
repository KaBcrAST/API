const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Fonction pour se connecter à MongoDB
const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.COSMOS_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1); // Quitte le processus si la connexion échoue
  }
};

// Exporter la fonction de connexion
module.exports = connectDb;
