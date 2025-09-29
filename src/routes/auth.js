const express = require('express');
const user = require('../models/User');
const { verifytoken } = require('../middleware/auth');
const storage = require('../database/storage');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const newuser = await user.create(email, username, password);
    const token = newuser.generatetoken();

    const sessions = await storage.getsessions();
    sessions.push({ userid: newuser.id, token: token });
    await storage.savesessions(sessions);

    res.status(201).json({ message: 'utilisateur enregistre avec succes', user: newuser.tojson(), token });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const founduser = await user.findbyemail(email);

    if (!founduser || !(await founduser.comparepassword(password))) {
      return res.status(401).json({ message: 'email ou mot de passe invalide' });
    }

    const token = founduser.generatetoken();

    const sessions = await storage.getsessions();
    const existingindex = sessions.findIndex(s => s.userid === founduser.id);
    if (existingindex !== -1) {
      sessions[existingindex].token = token;
    } else {
      sessions.push({ userid: founduser.id, token: token });
    }
    await storage.savesessions(sessions);

    res.status(200).json({ message: 'connexion reussie', user: founduser.tojson(), token });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', verifytoken, async (req, res, next) => {
  try {
    const sessions = await storage.getsessions();
    const updatedsessions = sessions.filter(s => s.userid !== req.user.id);
    await storage.savesessions(updatedsessions);
    res.status(200).json({ message: 'deconnexion reussie' });
  } catch (error) {
    next(error);
  }
});

router.get('/me', verifytoken, (req, res) => {
  res.status(200).json({ user: req.user.tojson() });
});

module.exports = router;
