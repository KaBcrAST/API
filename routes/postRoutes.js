const express = require('express');
const { createPost, getPosts, getFile } = require('../controllers/postController');
const upload = require('../config/multerConfig');
const router = express.Router();

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Créer un post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               authorId:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post créé avec succès
 *       400:
 *         description: Un post doit contenir soit une image soit une vidéo.
 *       500:
 *         description: Erreur lors de la création du post
 */
router.post('/posts', upload.single('file'), createPost);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Récupérer tous les posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Liste des posts
 *       500:
 *         description: Erreur lors de la récupération des posts
 */
router.get('/posts', getPosts);

/**
 * @swagger
 * /files/{filename}:
 *   get:
 *     summary: Récupérer un fichier par nom
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: filename
 *         schema:
 *           type: string
 *         required: true
 *         description: Nom du fichier
 *     responses:
 *       200:
 *         description: Fichier récupéré avec succès
 *       404:
 *         description: Fichier non trouvé
 *       500:
 *         description: Erreur lors de la récupération du fichier
 */
router.get('/files/:filename', getFile);

module.exports = router;