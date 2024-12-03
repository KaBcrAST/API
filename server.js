const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const profileRoutes = require('./routes/profileRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors'); // Importer le middleware CORS
require('dotenv').config();

const app = express();
app.use(express.json());

// Configurer le middleware CORS pour autoriser les requêtes provenant de http://localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Middleware pour gérer les erreurs d'authentification
const { checkJwt } = require('./middleware/checkJwt');

// Connecter à la base de données
connectDB();

// Connecter à la base de données avec mongoose
const mongoUri = 'mongodb://cosmosdb-mongo-prd:I475BTouZc9EF8LkkiJlKWFTqa0iEqQvuSfh4BqAJLnD0CVXrOxcHrarPY38dKL0bxKJoTB2k8DIACDby2hYhw==@cosmosdb-mongo-prd.mongo.cosmos.azure.com:10255/media_db?ssl=true&retrywrites=false';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation de l\'API pour le projet simple',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // L'option 'apis' doit inclure le fichier où sont définies les routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes de l'API
app.use('/api/posts', postRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api', postRoutes);
app.use('/protected-route', checkJwt, (req, res) => {
  res.send('This is a protected route');
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
