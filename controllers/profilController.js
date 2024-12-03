const axios = require('axios');
const Profile = require('../models/profileModel'); // Pour enregistrer ou récupérer la visibilité
require('dotenv').config();

/**
 * Récupérer les informations de l'utilisateur via Microsoft Graph
 * @param {Request} req 
 * @param {Response} res 
 */
const getUserInfo = async (req, res) => {
  const accessToken = req.headers.authorization.split(' ')[1];  // Récupérer l'access token depuis l'en-tête

  try {
    // Récupérer les données de l'utilisateur via Microsoft Graph API
    const graphResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userProfile = graphResponse.data;

    // Vérifier si un profil utilisateur existe dans la base de données
    let profile = await Profile.findOne({ userId: userProfile.id });

    if (!profile) {
      // Créer un profil de base avec les informations récupérées, mais sans biographie, seulement avec le nom et la visibilité (par défaut public)
      profile = new Profile({
        userId: userProfile.id,
        displayName: userProfile.displayName,
        visibility: 'public',  // La visibilité par défaut est publique
      });
      await profile.save();
    }

    // Retourner les informations de l'utilisateur et la visibilité
    res.status(200).json({ ...userProfile, visibility: profile.visibility });
  } catch (error) {
    console.error('Error while fetching user info:', error);
    res.status(500).json({ message: 'Error while fetching user info', error });
  }
};

/**
 * Mettre à jour la visibilité du profil
 * @param {Request} req 
 * @param {Response} res 
 */
const updateProfileVisibility = async (req, res) => {
  const { visibility } = req.body;  // Nouvelle visibilité : 'public' ou 'private'

  if (!['public', 'private'].includes(visibility)) {
    return res.status(400).json({ message: 'Invalid visibility option' });
  }

  try {
    // Vérifier si un profil existe pour cet utilisateur
    const profile = await Profile.findOne({ userId: req.user.userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Mettre à jour la visibilité
    profile.visibility = visibility;
    await profile.save();

    res.status(200).json({ message: 'Profile visibility updated successfully', profile });
  } catch (error) {
    console.error('Error while updating profile visibility:', error);
    res.status(500).json({ message: 'Error while updating profile visibility', error });
  }
};

module.exports = {
  getUserInfo,
  updateProfileVisibility,
};
