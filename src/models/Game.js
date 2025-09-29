const { v4: uuidv4 } = require('uuid');
const storage = require('../database/storage');

class Game {
  constructor(id, player1, player2 = null, board = [['', '', ''], ['', '', ''], ['', '', '']], currentplayer = null, status = 'waiting', winner = null) {
    this.id = id;
    this.player1 = player1;
    this.player2 = player2;
    this.board = board;
    this.currentplayer = currentplayer;
    this.status = status;
    this.winner = winner;
  }

  static async create(player1id) {
    const id = uuidv4();
    const newgame = new Game(id, player1id);
    const games = await storage.getgames();
    games.push(newgame);
    await storage.savegames(games);
    return newgame;
  }

  static async findbyid(gameid) {
    const games = await storage.getgames();
    const gamedata = games.find(g => g.id === gameid);
    return gamedata ? new Game(gamedata.id, gamedata.player1, gamedata.player2, gamedata.board, gamedata.currentplayer, gamedata.status, gamedata.winner) : null;
  }

  static async findbyplayerid(playerid) {
    const games = await storage.getgames();
    return games.filter(g => g.player1 === playerid || g.player2 === playerid)
                     .map(gamedata => new Game(gamedata.id, gamedata.player1, gamedata.player2, gamedata.board, gamedata.currentplayer, gamedata.status, gamedata.winner));
  }

  async join(player2id) {
    if (this.status !== 'waiting') {
      throw new Error('cette partie n\'est pas en attente d\'un joueur');
    }
    if (this.player1 === player2id) {
      throw new Error('vous ne pouvez pas rejoindre votre propre partie');
    }
    this.player2 = player2id;
    this.currentplayer = this.player1;
    this.status = 'in_progress';
    await this.save();
    return this;
  }

  async play(playerid, row, col) {
    if (this.status !== 'in_progress') {
      throw new Error('la partie n\'est pas en cours');
    }
    if (this.currentplayer !== playerid) {
      throw new Error('ce n\'est pas votre tour');
    }
    if (row < 0 || row > 2 || col < 0 || col > 2) {
      throw new Error('coordonnees invalides');
    }
    if (this.board[row][col] !== '') {
      throw new Error('cette case est deja prise');
    }

    const marker = (playerid === this.player1) ? 'x' : 'o';
    this.board[row][col] = marker;

    if (this.checkwin(marker)) {
      this.winner = playerid;
      this.status = 'finished';
    } else if (this.checkdraw()) {
      this.winner = 'draw';
      this.status = 'finished';
    } else {
      this.currentplayer = (playerid === this.player1) ? this.player2 : this.player1;
    }
    await this.save();
    return this;
  }

  checkwin(marker) {
    const lines = [
      [this.board[0][0], this.board[0][1], this.board[0][2]],
      [this.board[1][0], this.board[1][1], this.board[1][2]],
      [this.board[2][0], this.board[2][1], this.board[2][2]],
      [this.board[0][0], this.board[1][0], this.board[2][0]],
      [this.board[0][1], this.board[1][1], this.board[2][1]],
      [this.board[0][2], this.board[1][2], this.board[2][2]],
      [this.board[0][0], this.board[1][1], this.board[2][2]],
      [this.board[0][2], this.board[1][1], this.board[2][0]],
    ];
    return lines.some(line => line.every(cell => cell === marker));
  }

  checkdraw() {
    return this.board.every(row => row.every(cell => cell !== ''));
  }

  async save() {
    const games = await storage.getgames();
    const index = games.findIndex(g => g.id === this.id);
    if (index !== -1) {
      games[index] = this;
      await storage.savegames(games);
    } else {
      throw new Error('partie non trouvee pour la sauvegarde');
    }
  }

  tojson() {
    return {
      id: this.id,
      player1: this.player1,
      player2: this.player2,
      board: this.board,
      currentplayer: this.currentplayer,
      status: this.status,
      winner: this.winner,
    };
  }
}

module.exports = Game;
