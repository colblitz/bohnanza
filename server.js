// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

const Game = require('./util/game.js');

app.set('port', 3001);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(3001, function() {
  console.log('Starting server on port 3001');
});

var players = {};
var games = {};
var nextId = 0;

io.on('connection', function(socket) {

  var log = function(msg) {
    console.log("[" + socket.id + "] - " + msg);
  };

  socket.on('new player', function() {
    log("new player");
    players[socket.id] = {
      id: socket.id
    };
  });

  socket.on('new game request', function(callback) {
    log("new game request");
    let g = new Game(nextId);
    games[nextId] = g;
    socket.join(nextId);
    g.addPlayer(socket.id);
    players[socket.id]["game"] = nextId;
    callback({
      success: true,
      game: g.getJson()
    });

    nextId++;
  });

  socket.on('join game request', function(data, callback) {
    log("join game request: " + data.id);
    let id = data.id;
    if (id in games) {
      socket.join(id);
      let g = games[id];
      g.addPlayer(socket.id);
      players[socket.id]["game"] = id;
      callback({
        success: true,
        game: g.getJson(),
      });
      socket.to(id).emit('game update', { game: g.getJson() });
    } else {
      callback({
        success: false,
        error: "Game with id " + id + " does not exist"
      });
    }
  });

  socket.on('leave game request', function(callback) {
    log("leave game request");
    let id = players[socket.id]["game"];
    log("id: " + id);
    if (id !== undefined) {
      let g = games[id];
      socket.leave(id);
      g.removePlayer(socket.id);
      delete players[socket.id]["game"];
      callback({ success: true });

      if (g.isEmpty()) {
        console.log("game " + id + " is empty, deleting");
        delete games[id];
      } else {
        socket.to(id).emit('game update', { game: g.getJson() });
      }
    } else {
      callback({
        success: false,
        error: "Not in a game"
      });
    }
  });
});