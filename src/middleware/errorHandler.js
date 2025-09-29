const errorhandler = (err, req, res, next) => {
  console.error('erreur:', err);

  if (err.name === 'jsonwebtokenerror') {
    return res.status(401).json({ error: 'token invalide', message: 'token d\'authentification invalide' });
  }

  if (err.name === 'tokenexpirederror') {
    return res.status(401).json({ error: 'token expire', message: 'session expiree, reconnectez-vous' });
  }

  const statuscode = err.statuscode || 500;
  const message = err.message || 'erreur serveur';

  res.status(statuscode).json({
    error: 'erreur',
    message: message
  });
};

module.exports = { errorhandler };
