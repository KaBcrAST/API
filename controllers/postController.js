const Post = require('../models/postModel');

// Créer un post
const createPost = async (req, res) => {
  const { title, body, authorId } = req.body;
  try {
    const post = new Post({ title, body, author: authorId });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du post', error });
  }
};

// Récupérer tous les posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'displayName');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des posts', error });
  }
};

module.exports = { createPost, getPosts };
