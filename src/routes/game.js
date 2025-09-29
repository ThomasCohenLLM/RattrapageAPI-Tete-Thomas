const express = require('express');
const Game = require('../models/Game');
const { verifytoken } = require('../middleware/auth');
const storage = require('../database/storage');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const games = await storage.getgames();
    res.json({ games });
  } catch (error) {
    res.status(500).json({ error: 'erreur serveur' });
  }
});

router.post('/', verifytoken, async (req, res) => {
  try {
    const game = await Game.create(req.user.id);
    res.status(201).json({
      message: 'partie creee',
      game
    });
  } catch (error) {
    res.status(500).json({ error: 'erreur creation partie' });
  }
});

router.post('/:id/join', verifytoken, async (req, res) => {
  try {
    const gamedata = await Game.findbyid(req.params.id);
    if (!gamedata) {
      return res.status(404).json({ error: 'partie non trouvee' });
    }
    
    if (gamedata.player1 === req.user.id) {
      return res.status(400).json({ error: 'vous ne pouvez pas rejoindre votre propre partie' });
    }
    
    const game = new Game(gamedata.id, gamedata.player1);
    Object.assign(game, gamedata);
    
    const updatedgame = await game.join(req.user.id);
    res.json({
      message: 'partie rejointe',
      game: updatedgame
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/play', verifytoken, async (req, res) => {
  try {
    const { row, col } = req.body;
    const gamedata = await Game.findbyid(req.params.id);
    
    if (!gamedata) {
      return res.status(404).json({ error: 'partie non trouvee' });
    }
    
    if (gamedata.player1 !== req.user.id && gamedata.player2 !== req.user.id) {
      return res.status(403).json({ error: 'vous ne faites pas partie de cette partie' });
    }
    
    const game = new Game(gamedata.id, gamedata.player1);
    Object.assign(game, gamedata);
    
    const updatedgame = await game.play(req.user.id, row, col);
    res.json({
      message: 'coup joue',
      game: updatedgame
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findbyid(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'partie non trouvee' });
    }
    
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'erreur serveur' });
  }
});

module.exports = router;
