const Post = require('../models/postModel');

// Créer un post
const createPost = async (req, res) => {
  const { title, body, authorId } = req.body;
  const file = req.file;
  let image = null;
  let video = null;

  if (!file) {
    return res.status(400).json({ message: 'Un post doit contenir soit une image soit une vidéo.' });
  }

  if (file.mimetype.startsWith('image/')) {
    image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  } else if (file.mimetype.startsWith('video/')) {
    video = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  } else {
    return res.status(400).json({ message: 'Le fichier doit être soit une image soit une vidéo.' });
  }

  try {
    const post = new Post({ title, body, author_id: authorId, image, video });
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

// Récupérer un fichier par nom
const getFile = async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du fichier', error });
  }
};

// Modifier un post
const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, body, userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    // Vérifier si l'utilisateur est l'auteur du post
    if (post.author_id !== userId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier ce post' });
    }

    post.title = title || post.title;
    post.body = body || post.body;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification du post', error });
  }
};

// Supprimer un post
const deletePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    // Vérifier si l'utilisateur est l'auteur du post
    if (post.author_id !== userId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer ce post' });
    }

    await post.remove();
    res.status(200).json({ message: 'Post supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du post', error });
  }
};

module.exports = {
  createPost,
  getPosts,
  getFile,
  updatePost,
  deletePost,
};