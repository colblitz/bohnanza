// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

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

var game = {};

// Add the WebSocket handlers
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      id: socket.id
    };
  });

  socket.on('clicked button', function() {
    console.log(socket.id + " clicked the button");
    io.emit('message', socket.id + " clicked the button");
  });

  socket.on('game button clicked', function() {

    // board = new Array(3);
    // for (var i = 0; i < board.length; i++) {
    //   [i] = new Array(3);
    // }

    game = {
      next: 'X',
      board: Array.from(Array(3), () => new Array(3))
    };
    console.log("emitting new game");
    io.emit('new game');
  });

  socket.on('clicked', function(data) {
    console.log(data);
    game['last'] = {x: data.x, y: data.y};
    game['board'][data.x][data.y] = game.next;
    game['next'] = game.next == 'X' ? 'O' : 'X';
    console.log("new board:");
    console.log(game);
    // game = Object.assign(game, {
    //   last: [data.x, data.y],
    //   next: game.next == 'X' ? 'O' : 'X'
    // });
    io.emit('game state', game);
  });

  socket.on('disconnect', function() {
    console.log(socket.id + ' disconnected');
  });
});

setInterval(function() {
  io.sockets.emit('message', 'hi!');
}, 3000);

// io.on('connection', function(socket) {

//   socket.on('movement', function(data) {
//     var player = players[socket.id] || {};
//     if (data.left) {
//       player.x -= 5;
//     }
//     if (data.up) {
//       player.y -= 5;
//     }
//     if (data.right) {
//       player.x += 5;
//     }
//     if (data.down) {
//       player.y += 5;
//     }
//   });
// });