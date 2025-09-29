const express = require('express');
const Game = require('../models/Game');
const { verifytoken } = require('../middleware/auth');

const router = express.router();

router.get('/profile', verifytoken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username
    }
  });
});

router.get('/games', verifytoken, async (req, res) => {
  try {
    const games = await Game.findall();
    const usergames = games.filter(game => 
      game.player1 === req.user.id || game.player2 === req.user.id
    );
    
    res.json({ games: usergames });
  } catch (error) {
    res.status(500).json({ error: 'erreur serveur' });
  }
});

router.get('/stats', verifytoken, async (req, res) => {
  try {
    const games = await Game.findall();
    const usergames = games.filter(game => 
      game.player1 === req.user.id || game.player2 === req.user.id
    );
    
    const finishedgames = usergames.filter(game => game.status === 'finished');
    const wins = finishedgames.filter(game => game.winner === req.user.id).length;
    const draws = finishedgames.filter(game => game.winner === 'draw').length;
    const losses = finishedgames.length - wins - draws;
    
    res.json({
      totalgames: usergames.length,
      finishedgames: finishedgames.length,
      wins,
      draws,
      losses,
      winrate: finishedgames.length > 0 ? (wins / finishedgames.length * 100).tofixed(1) : 0
    });
  } catch (error) {
    res.status(500).json({ error: 'erreur serveur' });
  }
});

module.exports = router;
