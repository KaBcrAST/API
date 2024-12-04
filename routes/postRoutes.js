const express = require('express');
const { createPost, getPosts, getPostAuthors, createUserFromGraph } = require('../controllers/postController');
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               authorId:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post créé avec succès
 *       500:
 *         description: Erreur lors de la création du post
 */
router.post('/posts', createPost);

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
 * /post-authors:
 *   get:
 *     summary: Récupérer tous les noms des auteurs des posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Liste des noms des auteurs
 *       500:
 *         description: Erreur lors de la récupération des auteurs des posts
 */
router.get('/post-authors', getPostAuthors);

/**
 * @swagger
 * /create-user-from-graph:
 *   post:
 *     summary: Créer un utilisateur à partir des informations de Microsoft Graph
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *               displayName:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       500:
 *         description: Erreur lors de la création de l'utilisateur
 */
router.post('/create-user-from-graph', async (req, res) => {
  try {
    const user = await createUserFromGraph(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur à partir de Microsoft Graph', error });
  }
});

module.exports = router;
