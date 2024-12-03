const express = require('express');
const { createPost, getPosts, getPostAuthors, createUserFromGraph } = require('../controllers/postController');
const router = express.Router();

router.post('/posts', createPost);
router.get('/posts', getPosts);
router.get('/post-authors', getPostAuthors);
router.post('/create-user-from-graph', async (req, res) => {
  try {
    const user = await createUserFromGraph(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur à partir de Microsoft Graph', error });
  }
});

module.exports = router;
