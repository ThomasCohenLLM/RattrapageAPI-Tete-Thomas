const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'api morpion - pret a jouer !' });
});

app.get('/', (req, res) => {
  res.json({ message: 'api morpion - jeu entre potes !', version: 'v1' });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'route non trouvee', message: `la route ${req.method} ${req.originalUrl} n'existe pas` });
});

app.listen(port, () => {
  console.log(`api morpion demarree sur le port ${port}`);
});

module.exports = app;
