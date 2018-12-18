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
    this.plantedFromHand = 0;
    this.playerIds = [];
    this.deck = new Deck(10);
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

  nextTurn() {
    this.currentTurn = (this.currentTurn + 1) % (this.playerIds.length);
    this.currentPhaseInTurn = 0;
    this.plantedFromHand = 0;
    this.turnedOver = [];
    this.trades = [];
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
  //   index: int
  // }
  // UPGRADE
  // START_PHASE {
  //   phase: int
  // }
  // PLANT - optional second card {
  //   type: HAND or MID or TRADE
  //   index: int
  //   slot: id
  // }
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
      var harvested = field.harvest(request.index);
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

        this.nextTurn();
        // TODO: check game over
      } else {
        return { success: false, error: "Invalid phase" };
      }

    } else if (request.action == "PLANT") {
      checkPlayer();
      if (request.type == "HAND" && this.plantedFromHand < 2) {
        var card = player.removeCard(0);
        field.plant(request.slot, card);
        this.plantedFromHand += 1;
      } else if (request.type == "MID") {
        var card = this.turnedOver[request.index];
        this.turnedOver[request.index] = null; // TODO: splice instead?
        field.plant(request.slot, card);
      } else if (request.type == "TRADE") {
        var card = this.trades[request.index];
        this.trades[request.index] = null; // TODO: splice instead?
        field.plant(request.slot, card);
      }
    } else if (request.action == "PROPOSE_TRADE") {
      checkPlayer();

    } else if (request.action == "CONFIRM_TRADE") {

    } else {
      return { success: false, error: "Unknown action" };
    }
  }

  canStart() {
    return this.playerIds.length > 1;
  }

  getJson() {
    var playerJson = {};
    Object.keys(this.players).forEach(function(key) {
      playerJson[key] = this.players[key].getJson();
    });
    var fieldJson = {};
    Object.keys(this.fields).forEach(function(key) {
      fieldJson[key] = this.fields[key].getJson();
    });

    return {
      id: this.id,
      isStarted: this.isStarted,
      isEnded: this.isEnded,
      currentTurn: this.currentTurn,
      currentPhaseInTurn: this.currentPhaseInTurn,
      plantedFromHand: this.plantedFromHand,
      playerIds: this.playerIds,
      deck: this.deck.getJson(),
      players: playerJson,
      fields: fieldJson,
      turnedOver: this.turnedOver.map(x => x.getJson()),
      trades: this.trades.map(x => x.getJson())
    };
  }

  getJsonForPlayer(pid) {
    var playerJson = {};
    Object.keys(this.players).forEach(function(key) {
      playerJson[key] = this.players[key].getJsonForPlayer(key);
    });
    var fieldJson = {};
    Object.keys(this.fields).forEach(function(key) {
      fieldJson[key] = this.fields[key].getJson();
    });

    return {
      id: this.id,
      isStarted: this.isStarted,
      isEnded: this.isEnded,
      currentTurn: this.currentTurn,
      currentPhaseInTurn: this.currentPhaseInTurn,
      plantedFromHand: this.plantedFromHand,
      playerIds: this.playerIds,
      deck: this.deck.getJson(),
      players: playerJson,
      fields: fieldJson,
      turnedOver: this.turnedOver.map(x => x.getJson()),
      trades: this.trades.map(x => x.getJson())
    };
  }
};

module.exports = Game;