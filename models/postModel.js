const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author_id: { type: String, required: true },
  image: { type: String }, // Champ pour les images
  video: { type: String }, // Champ pour les vidéos
  // Ajoutez d'autres champs nécessaires pour votre post
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
