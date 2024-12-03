const Profile = require('../models/profileModel');

// Créer un profil
const createProfile = async (req, res) => {
  const { displayName, bio } = req.body;
  try {
    const profile = new Profile({ displayName, bio });
    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du profil', error });
  }
};

// Récupérer un profil par son ID
const getProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil', error });
  }
};

module.exports = { createProfile, getProfile };
