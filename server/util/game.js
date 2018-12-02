const Deck = require('./deck.js');
const Constants = require('./constants.js');
const Player = require('./player.js');
const Field = require('./field.js');

class Game {
  constructor(id) {
    this.id = id;
    this.isStarted = false;
    this.isEnded = false;
    this.currentTurn = null;
    this.currentPhaseInTurn = 0;
    this.deck = new Deck(10);
    this.playerIds = [];
    this.players = {};
    this.fields = {};
    this.turnedOver = [];
    this.trades = [];
  }

  addPlayer(id) {
    this.playerIds.push(id);
  }

  removePlayer(id) {
    var index = this.playerIds.indexOf(id);
    if (index !== -1) this.playerIds.splice(index, 1);
  }

  startGame() {
    this.isStarted = true;
    this.currentTurn = Math.floor(Math.random() * this.playerIds.length);
    this.playerIds.forEach(function(id) {
      this.players[id] = new Player(id);
      this.fields[id] = new Field(Constants.STARTING_PLOTS);
    }, this);
  }

  // actions
  // anytime:
  // - harvest a plot
  // - upgrade plots
  // during turn
  // - START_PHASE 1 (success if can plant)
  // - plant first card
  // - plant optional second card
  // - START_PHASE 2 (2 cards get turned over)
  // - propose trade
  // - modify trade
  // - confirm trade
  // - START_PHASE 3 (3 cards drawn)


  // TODO: plant cards from middle
  // HARVEST {
  //   plot: int
  // }
  // UPGRADE
  // START_PHASE {
  //   phase: int
  // }
  // PLANT - optional second card
  // PROPOSE_TRADE (modifies existing) {
  //   offer:
  //   person: empty
  // }
  // CONFIRM_TRADE {
  //   id: id
  // }

  // {
  //   action: HARVEST,
  //   player: playerId,
  //   other keys
  // }
  makeMove(request) {
    // Basic checks
    if (!this.isStarted) { return { success: false, error: "Game not started" }; }
    if (this.isEnded) { return { success: false, error: "Game already over" }; }
    if (!(request.player in this.playerIds)) { return { success: false, error: "Invalid playerId" }; }

    function checkPlayer() {
      if (request.player != this.playerIds[this.currentTurn]) {
        return { success: false, error: "Not your turn" };
      }
    }

    var player = this.players[request.player];
    var field = this.fields[request.player];

    if (request.action == "HARVEST") {
      var harvested = field.harvest(request.plot);
      if (harvested.length > 0) {
        // calculate amount for harvested, add gold
        var gold = Card.calculateValue(harvested);
        player.incrGold(gold);
        this.deck.discard(harvested);
      }
    } else if (request.action == "UPGRADE") {
      if (player.gold > Constants.COST_TO_UPGRADE) {
        player.incrGold(Constants.COST_TO_UPGRADE * -1);
        field.expand();
      }
    } else if (request.action == "START_PHASE") {
      checkPlayer();
      if (request.phase == 1) {
        // first card gets planted
        if (!field.canPlant(player.hand[0])) {
          return { success: false, error: "Cannot plant first card" };
        }
      } else if (request.phase == 2) {
        // 2 cards get turned over, can trade
        var cards = this.deck.drawCards(Constants.TURNED_OVER_CARDS);
        this.turnedOver = cards;
      } else if (request.phase == 3) {
        // 3 cards drawn, next person's turn
        // TODO: check that all cards planted
        var cards = this.deck.drawCards(Constants.NUM_TO_DRAW);
        player.drewCards(cards);

        this.currentTurn = (this.currentTurn + 1) % (this.playerIds.length);
        this.turnedOver = [];
        // TODO: check game over
      } else {
        return { success: false, error: "Invalid phase" };
      }

    } else if (request.action == "PLANT") {
      checkPlayer();
      // card gets planted
    } else if (request.action == "PROPOSE_TRADE") {
      checkPlayer();
    } else if (request.action == "CONFIRM_TRADE") {

    } else {
      return { success: false, error: "Unknown action" };
    }

    // if (request.player == this.playerIds[this.currentTurn]) {
    //   var drawn = [];
    //   for (var i = 0; i < request.draw; i++) {
    //     var c = this.deck.drawCard();
    //     console.log(request.player + " drew " + c.number);
    //     this.points[request.player] += c.number;
    //     drawn.push(c);
    //     this.deck.discard(c);
    //   }

    //   if (this.deck.getTimesShuffled() >= 3) {
    //     this.isEnded = true;
    //   }

    //   this.currentTurn = (this.currentTurn + 1) % (this.playerIds.length);

    //   return { success: true, drawn: drawn };
    // } else {
    //   return { success: false, error: "Not your turn" };
    // }
  }

  canStart() {
    return this.playerIds.length > 1;
  }

  getJson() {
    return {
      id: this.id,
      playerIds: this.playerIds,
      isStarted: this.isStarted,
      isEnded: this.isEnded,
      currentTurn: this.currentTurn,
      deck: this.deck.getJson(),
    };
  }

  getJsonForPlayer(pid) {
    return {
      id: this.id,
      playerIds: this.playerIds,
      isStarted: this.isStarted,
      isEnded: this.isEnded,
      currentTurn: this.currentTurn,
      deck: this.deck.getJson(),
    };
  }
};

module.exports = Game;