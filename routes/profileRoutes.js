const express = require('express');
const { createProfile, getProfile } = require('../controllers/profilController');

const router = express.Router();

// Route pour créer un profil
router.post('/', createProfile);

// Route pour récupérer un profil par ID
router.get('/:id', getProfile);

module.exports = router;
