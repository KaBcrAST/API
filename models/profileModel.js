const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true },
    bio: { type: String },
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
