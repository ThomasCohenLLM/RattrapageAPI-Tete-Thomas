# api morpion

api simple pour jouer au morpion entre amis.

## demarrage rapide

```bash
# installer les dependances
npm install

# copier la config
cp env.example .env

# demarrer le serveur
npm start
```

## endpoints disponibles

### authentification

**POST** `/api/v1/auth/register`
```json
{
  "email": "alice@email.com",
  "username": "Alice",
  "password": "motdepasse"
}
```

**POST** `/api/v1/auth/login`
```json
{
  "email": "alice@email.com", 
  "password": "motdepasse"
}
```

**POST** `/api/v1/auth/logout`
- header: `authorization: bearer <token>`

**GET** `/api/v1/auth/me`
- header: `authorization: bearer <token>`

### jeu

**GET** `/api/v1/games` - lister les parties disponibles

**POST** `/api/v1/games` - creer une partie
- header: `authorization: bearer <token>`

**POST** `/api/v1/games/:id/join` - rejoindre une partie
- header: `authorization: bearer <token>`

**POST** `/api/v1/games/:id/play` - jouer un coup
- header: `authorization: bearer <token>`
```json
{
  "row": 0,
  "col": 1
}
```

**GET** `/api/v1/games/:id` - recuperer une partie

### utilisateur

**GET** `/api/v1/users/profile` - mon profil
- header: `authorization: bearer <token>`

**GET** `/api/v1/users/games` - mes parties
- header: `authorization: bearer <token>`

**GET** `/api/v1/users/stats` - mes statistiques
- header: `authorization: bearer <token>`

## comment jouer

1. **creer un compte** : `POST /api/v1/auth/register`
2. **se connecter** : `POST /api/v1/auth/login`
3. **creer une partie** : `POST /api/v1/games`
4. **un ami rejoint** : `POST /api/v1/games/:id/join`
5. **jouer** : `POST /api/v1/games/:id/play` avec `{"row": 0, "col": 1}`

## stockage

les donnees sont stockees dans `src/data/` :
- `users.json` - comptes utilisateurs
- `games.json` - parties en cours/terminees  
- `sessions.json` - sessions actives

## amusez-vous bien !
