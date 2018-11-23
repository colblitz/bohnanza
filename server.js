import express from 'express'; 
import webpackMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
import http from 'http';
import SocketIO from 'socket.io';

import Game from './util/deck';

const app = express();

let server = http.Server(app);
let io = new SocketIO(server);

app.use(webpackMiddleware(webpack(webpackConfig)));

server.listen(3001, () => {
  console.log('Starting server on port 3001');
});

var players = {};
var games = {};
var nextId = 0;
io.on('connection', function(socket) {

  var log = function(msg) {
    console.log("[" + socket.id + "] - " + msg);
  };

  var errorResponse = function(callback, msg) {
    callback({
      success: false,
      error: msg
    });
  };

  socket.on('new player', function(callback) {
    log("new player");
    players[socket.id] = {
      id: socket.id
    };

    callback({ success: true, id: socket.id });
  });

  socket.on('new game request', function(callback) {
    log("new game request");

    var gid = nextId;
    nextId++;

    let g = new Game(gid);
    games[gid] = g;
    socket.join(gid);
    g.addPlayer(socket.id);
    players[socket.id]["game"] = gid;

    callback({ success: true });
    io.in(gid).emit('game update', { game: g.getJson() });
  });

  socket.on('join game request', function(data, callback) {
    log("join game request: " + data.id);
    let gid = data.id;

    if (!(gid in games)) {
      errorResponse(callback, "Game with id " + gid + " does not exist");
      return;
    }

    socket.join(gid);
    let g = games[gid];

    if (g.isStarted) {
      errorResponse(callback, "Game with id " + gid + " has already started");
      return;
    }

    g.addPlayer(socket.id);
    players[socket.id]["game"] = gid;
    callback({ success: true });

    io.in(gid).emit('game update', { game: g.getJson() });
  });

  socket.on('leave game request', function(callback) {
    let gid = players[socket.id]["game"];
    log("leave game request: " + gid);

    if (typeof gid == 'undefined') {
      errorResponse(callback, "Not in a game");
      return;
    }

    let g = games[gid];
    socket.leave(gid);
    g.removePlayer(socket.id);
    delete players[socket.id]["game"];
    callback({ success: true });

    if (g.players.length == 0) {
      console.log("game " + gid + " is empty, deleting");
      delete games[gid];
    } else {
      io.in(gid).emit('game update', { game: g.getJson() });
    }
  });

  socket.on('start game request', function(callback) {
    let gid = players[socket.id]["game"];
    log("start game request: " + gid);

    if (typeof gid == 'undefined') {
      errorResponse(callback, "Not in a game");
      return;
    }

    let g = games[gid];

    if (!g.canStart()) {
      errorResponse(callback, "Game not ready to start");
      return;
    }

    g.startGame();

    callback({ success: true });
    io.in(gid).emit('game update', { game: g.getJson() });
  });

  socket.on('game move', function(data, callback) {
    let gid = players[socket.id]["game"];
    log("game move: " + JSON.stringify(data));

    if (typeof gid == 'undefined') {
      errorResponse(callback, "Not in a game");
      return;
    }

    let g = games[gid];

    let result = g.makeMove(Object.assign({player: socket.id}, data));

    callback(result);
    io.in(gid).emit('game update', { game: g.getJson() });
  });
});