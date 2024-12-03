const axios = require('axios');
const Profile = require('../models/profileModel');
require('dotenv').config();

/**
 * Fonction pour obtenir un profil utilisateur ou en créer un s'il n'existe pas
 * @param {Request} req 
 * @param {Response} res 
 */
const getOrCreateProfile = async (req, res) => {
  const { userId } = req.params;
  const accessToken = req.headers.authorization.split(' ')[1];  // Récupérer l'access token depuis l'en-tête

  try {
    // Vérifier si le profil existe déjà dans notre base de données
    let profile = await Profile.findOne({ userId });

    if (!profile) {
      // Si aucun profil, récupérer les données de l'utilisateur via Microsoft Graph API
      const graphResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userProfile = graphResponse.data;

      // Créer un nouveau profil dans la base de données avec les données de Microsoft Graph
      profile = new Profile({
        userId,
        displayName: userProfile.displayName,
        bio: userProfile.jobTitle || 'No bio available', // Utilisation de jobTitle comme bio
      });
      await profile.save();  // Sauvegarder le profil dans la base de données
    }

    // Retourner le profil existant ou nouvellement créé
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error while fetching profile:', error);
    res.status(500).json({ message: 'Error while fetching profile', error });
  }
};

/**
 * Fonction pour créer un profil utilisateur
 * @param {Request} req 
 * @param {Response} res 
 */
const createProfile = async (req, res) => {
  const { userId, displayName, bio } = req.body;
  
  try {
    // Vérifier si un profil existe déjà pour cet utilisateur
    let profile = await Profile.findOne({ userId });

    if (profile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    // Créer un nouveau profil
    profile = new Profile({ userId, displayName, bio });
    await profile.save();

    res.status(201).json(profile);
  } catch (error) {
    console.error('Error while creating profile:', error);
    res.status(500).json({ message: 'Error while creating profile', error });
  }
};

module.exports = {
  getOrCreateProfile,
  createProfile,
};
