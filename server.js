const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');
const profileRoutes = require('./routes/profileRoutes'); // Importer les routes de profil
const { swaggerUi, specs } = require('./swaggerConfig'); // Importer la configuration Swagger
require('dotenv').config(); // Charger les variables d'environnement

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Connecter à la base de données avec mongoose
const mongoUri = process.env.COSMOS_DB_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => console.error('MongoDB connection error:', err));

// Routes de l'API
app.use('/api', postRoutes);
app.use('/api', profileRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
