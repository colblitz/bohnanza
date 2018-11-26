// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

const State = require('./server/state.js');

// express server setup
app.set('port', 3001);
// app.use('/static', express.static(__dirname + '/static'));
app.use('/', express.static('dist', { index: false }));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname + '/dist', 'index.html'));
});

// Starts the server.
server.listen(3001, function() {
  console.log('Starting server on port 3001');
});

// init state and attach message handlers
const state = new State();
const nav = require('./server/handlers/navigation.js')(io, state);
const game = require('./server/handlers/game.js')(io, state);