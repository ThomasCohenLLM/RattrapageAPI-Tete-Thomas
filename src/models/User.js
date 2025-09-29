const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const storage = require('../database/storage');

class user {
  constructor(id, email, username, passwordhash) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.passwordhash = passwordhash;
  }

  static async create(email, username, password) {
    const users = await storage.getusers();
    if (users.find(u => u.email === email)) {
      throw new Error('un utilisateur avec cet email existe deja');
    }
    const id = uuidv4();
    const passwordhash = await bcrypt.hash(password, 10);
    const newuser = new user(id, email, username, passwordhash);
    users.push(newuser);
    await storage.saveusers(users);
    return newuser;
  }

  static async findbyemail(email) {
    const users = await storage.getusers();
    const userdata = users.find(u => u.email === email);
    return userdata ? new user(userdata.id, userdata.email, userdata.username, userdata.passwordhash) : null;
  }

  static async findbyid(id) {
    const users = await storage.getusers();
    const userdata = users.find(u => u.id === id);
    return userdata ? new user(userdata.id, userdata.email, userdata.username, userdata.passwordhash) : null;
  }

  async comparepassword(candidatepassword) {
    return bcrypt.compare(candidatepassword, this.passwordhash);
  }

  generatetoken() {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  tojson() {
    const { passwordhash, ...userwithoutpassword } = this;
    return userwithoutpassword;
  }
}

module.exports = user;
