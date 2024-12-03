const express = require('express');
const { checkJwt } = require('../middleware/checkJwt');
const { getUserInfo, updateProfileVisibility } = require('../controllers/profilController');

const router = express.Router();

// Récupérer les informations de l'utilisateur après OAuth
router.get('/me', checkJwt, getUserInfo);

// Mettre à jour la visibilité du profil
router.put('/visibility', checkJwt, updateProfileVisibility);

module.exports = router;
