const express = require('express');
const { getOrCreateProfile, createProfile } = require('../controllers/profilController');
const { checkJwt } = require('../middleware/checkJwt.js'); // Middleware pour vérifier le JWT

const router = express.Router();

/**
 * @swagger
 * /api/profiles/{userId}:
 *   get:
 *     summary: Récupère ou crée un profil utilisateur
 *     description: Si un profil utilisateur existe déjà, le retourne. Sinon, il le crée en utilisant les données de Microsoft Graph.
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: L'ID de l'utilisateur pour lequel le profil est récupéré ou créé.
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré ou créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Token JWT invalide ou manquant.
 *       500:
 *         description: Erreur lors de la récupération ou de la création du profil.
 */
router.get('/:userId', checkJwt, getOrCreateProfile);

/**
 * @swagger
 * /api/profiles:
 *   post:
 *     summary: Créer un profil utilisateur
 *     description: Crée un profil utilisateur avec le nom d'affichage et la biographie fournis.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               displayName:
 *                 type: string
 *               bio:
 *                 type: string
 *             required:
 *               - userId
 *               - displayName
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Profil créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Le profil existe déjà pour cet utilisateur.
 *       401:
 *         description: Token JWT invalide ou manquant.
 *       500:
 *         description: Erreur lors de la création du profil.
 */
router.post('/', checkJwt, createProfile);

module.exports = router;
