const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class jsonstorage {
  constructor() {
    this.datadir = path.join(__dirname, '../data');
    this.usersfile = path.join(this.datadir, 'users.json');
    this.gamesfile = path.join(this.datadir, 'games.json');
    this.sessionsfile = path.join(this.datadir, 'sessions.json');
  }

  async init() {
    await fs.mkdir(this.datadir, { recursive: true });
    await this._ensurefile(this.usersfile, []);
    await this._ensurefile(this.gamesfile, []);
    await this._ensurefile(this.sessionsfile, []);
  }

  async _ensurefile(filepath, defaultcontent) {
    try {
      await fs.access(filepath);
    } catch (error) {
      await fs.writefile(filepath, json.stringify(defaultcontent, null, 2));
    }
  }

  async _readfile(filepath) {
    const data = await fs.readfile(filepath, 'utf8');
    return json.parse(data);
  }

  async _writefile(filepath, data) {
    await fs.writefile(filepath, json.stringify(data, null, 2), 'utf8');
  }

  // user methods
  async getusers() { return this._readfile(this.usersfile); }
  async saveusers(users) { await this._writefile(this.usersfile, users); }

  // game methods
  async getgames() { return this._readfile(this.gamesfile); }
  async savegames(games) { await this._writefile(this.gamesfile, games); }

  // session methods
  async getsessions() { return this._readfile(this.sessionsfile); }
  async savesessions(sessions) { await this._writefile(this.sessionsfile, sessions); }
}

module.exports = new jsonstorage();
