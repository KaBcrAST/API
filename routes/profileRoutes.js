const express = require('express');
const axios = require('axios');
const { checkJwt } = require('../middleware/checkJwt');
const { getUserInfo, updateProfileVisibility, getUserPosts } = require('../controllers/profilController');
const Profile = require('../models/profileModel');

const router = express.Router();

// Récupérer les informations de l'utilisateur après OAuth
router.get('/me', checkJwt, getUserInfo);

// Mettre à jour la visibilité du profil
router.put('/visibility', checkJwt, updateProfileVisibility);

/**
 * @swagger
 * /profiles/{email}:
 *   get:
 *     summary: Récupérer un profil par email
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email de l'utilisateur
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 *       404:
 *         description: Profil non trouvé
 *       500:
 *         description: Erreur lors de la récupération du profil
 */
router.get('/profiles/:email', async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.params.email });
    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil', error });
  }
});

/**
 * @swagger
 * /profiles/{email}:
 *   put:
 *     summary: Mettre à jour un profil par email
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *               bio:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *       404:
 *         description: Profil non trouvé
 *       500:
 *         description: Erreur lors de la mise à jour du profil
 */
router.put('/profiles/:email', async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil', error });
  }
});

/**
 * @swagger
 * /profile/{userId}/posts:
 *   get:
 *     summary: Récupérer tous les posts d'un utilisateur
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des posts de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur lors de la récupération des posts
 */
router.get('/profile/:userId/posts', getUserPosts);

router.get('/user-id', checkJwt, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    res.status(200).json({ userId: response.data.id });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'ID de l\'utilisateur', error: error.message });
  }
});

module.exports = router;
