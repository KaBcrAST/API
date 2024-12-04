const Post = require('../models/postModel');
const Profile = require('../models/profileModel'); // Utiliser le modèle Profile

// Créer un post
const createPost = async (req, res) => {
  const { title, body, authorId, image } = req.body;
  try {
    const post = new Post({ title, body, author_id: authorId, image });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du post', error });
  }
};

// Récupérer tous les posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des posts', error });
  }
};

// Récupérer tous les noms des auteurs des posts
const getPostAuthors = async (req, res) => {
  try {
    const posts = await Post.find().populate('author_id', 'displayName');
    const authors = posts.map(post => post.author_id.displayName);
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des auteurs des posts', error });
  }
};

// Créer un utilisateur à partir des informations de Microsoft Graph
const createUserFromGraph = async (graphUser) => {
  try {
    if (!graphUser.mail) {
      throw new Error('Email is required');
    }
    let user = await Profile.findOne({ email: graphUser.mail });
    if (!user) {
      user = new Profile({
        displayName: graphUser.displayName,
        email: graphUser.mail,
        bio: graphUser.jobTitle,
      });
      await user.save();
    }
    return user;
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur à partir de Microsoft Graph', error);
    throw error;
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostAuthors,
  createUserFromGraph,
};