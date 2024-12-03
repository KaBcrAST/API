const express = require('express');
const { createPost, getPosts } = require('../controllers/postController');

const router = express.Router();

// Route pour créer un post
router.post('/', createPost);

// Route pour récupérer tous les posts
router.get('/', getPosts);

module.exports = router;
