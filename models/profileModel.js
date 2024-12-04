const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    isPublic: { type: Boolean, default: true }, // Champ pour indiquer si le profil est public ou privé
    // Ajoutez d'autres champs nécessaires pour votre utilisateur
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
