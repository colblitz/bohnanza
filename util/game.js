class Game {
  constructor(id) {
    this.id = id;
    this.players = [];
  }

  addPlayer(id) {
    this.players.push(id);
  }

  removePlayer(id) {
    var index = this.players.indexOf(id);
    if (index !== -1) this.players.splice(index, 1);
  }

  isEmpty() {
    return this.players.length == 0;
  }

  getJson() {
    return {
      id: this.id,
      players: this.players
    };
  }
};

module.exports = Game;