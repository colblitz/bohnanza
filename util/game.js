const Deck = require('./deck.js');

class Game {
  constructor(id) {
    this.id = id;
    this.players = [];
    this.isStarted = false;
    this.isEnded = false;
    this.currentTurn = null;
    this.deck = new Deck(10);
    this.points = {};
  }

  addPlayer(id) {
    this.players.push(id);
  }

  removePlayer(id) {
    var index = this.players.indexOf(id);
    if (index !== -1) this.players.splice(index, 1);
  }

  startGame() {
    this.isStarted = true;
    this.currentTurn = Math.floor(Math.random() * this.players.length);
    this.players.forEach(function(id) {
      this.points[id] = 0;
    }, this);
  }

  makeMove(request) {
    if (!this.isStarted) { return { success: false, error: "Game not started" }; }
    if (this.isEnded) { return { success: false, error: "Game already over" }; }

    if (request.player == this.players[this.currentTurn]) {
      var drawn = [];
      for (var i = 0; i < request.draw; i++) {
        var c = this.deck.drawCard();
        console.log(request.player + " drew " + c.number);
        this.points[request.player] += c.number;
        drawn.push(c);
        this.deck.discard(c);
      }

      if (this.deck.getTimesShuffled() >= 3) {
        this.isEnded = true;
      }

      this.currentTurn = (this.currentTurn + 1) % (this.players.length);

      return { success: true, drawn: drawn };
    } else {
      return { success: false, error: "Not your turn" };
    }
  }

  canStart() {
    return this.players.length > 1;
  }

  getJson() {
    return {
      id: this.id,
      players: this.players,
      isStarted: this.isStarted,
      isEnded: this.isEnded,
      currentTurn: this.currentTurn,
      deck: this.deck.getJson(),
      points: this.points,
    };
  }
};
module.exports = Game;
