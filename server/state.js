const Game = require('./util/game.js');

class State {
  constructor() {
    this.players = {};
    this.games = {};
    this.nextId = 0;
  }

  newPlayer(pid) {
    this.players[pid] = {
      id: pid
    };
  }

  createGame(pid) {
    var gid = this.nextId;
    this.nextId++;

    var g = new Game(gid);
    this.games[gid] = g;
    g.addPlayer(pid);
    this.players[pid]["game"] = gid;

    return { gid: gid };
  }

  joinGame(gid, pid) {
    if (!(gid in this.games)) {
      return { success: false, error: "Game " + gid + " does not exist" };
    }

    let g = games[gid];
    if (g.isStarted) {
      return { success: false, error: "Game " + gid + " has already started" };
    }

    g.addPlayer(pid);
    this.players[pid]["game"] = gid;
    return { success: true };
  }

  leaveGame(pid) {
    if (!(pid in this.players)) {
      return { success: false, error: "Player " + pid + " does not exist" };
    }
    var gid = players[pid]["game"];
    if (typeof gid == 'undefined') {
      return { success: false, error: "Player " + pid + " not in a game" };
    }

    var g = this.games[gid];
    g.removePlayer(pid);
    delete this.players[pid]["game"];

    var deleted = false;
    if (g.players.length == 0) {
      console.log("Game " + gid + " is empty, deleting");
      delete this.games[gid];
      deleted = true;
    }
    return { 
      success: true, 
      gid: gid,
      json: g.getJson(),
      deleted: deleted };
  }

  startGame(pid) {
    if (!(pid in this.players)) {
      return { success: false, error: "Player " + pid + " does not exist" };
    }
    var gid = players[pid]["game"];
    if (typeof gid == 'undefined') {
      return { success: false, error: "Player " + pid + " not in a game" };
    }

    var g = this.games[gid];
    g.startGame();
    return { success: true, json: g.getJson() };
  }

  gameMove(pid, data) {
    // TODO: figure out how to not duplicate this all the time - throws?
    if (!(pid in this.players)) {
      return { success: false, error: "Player " + pid + " does not exist" };
    }
    var gid = players[pid]["game"];
    if (typeof gid == 'undefined') {
      return { success: false, error: "Player " + pid + " not in a game" };
    }

    var g = this.games[gid];

    var result = g.makeMove(Object.assign({player: pid}, data));
    return { success: true, result: result, json: g.getJson() };
  }
};

module.exports = State;