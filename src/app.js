const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { errorhandler } = require('./middleware/errorHandler');
const storage = require('./database/storage');

const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const userRoutes = require('./routes/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'api morpion - pret a jouer !' });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'api morpion - jeu entre potes !', 
    version: 'v1',
    routes: {
      auth: '/api/v1/auth',
      games: '/api/v1/games',
      users: '/api/v1/users'
    }
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'route non trouvee', message: `la route ${req.method} ${req.originalUrl} n'existe pas` });
});

app.use(errorhandler);

storage.init().then(() => {
  app.listen(port, () => {
    console.log(`api morpion demarree sur le port ${port}`);
    console.log(`pret a jouer entre potes`);
  });
}).catch(err => {
  console.error('erreur demarrage:', err);
});

module.exports = app;
