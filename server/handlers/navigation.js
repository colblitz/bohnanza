const Types = require('./types.js');

exports = module.exports = function(io, state) {
  var nextId = 0;
  io.on('connection', function (socket) {
    // util methods - TODO: find way to not have to duplicate
    var log = function(msg) {
      console.log("[" + socket.id + "] - " + msg);
    };

    var errorResponse = function(callback, msg) {
      callback({
        success: false,
        error: msg
      });
    };

    // message methods
    socket.on(Types.API_ON_CONNECT, function(callback) {
      log("new player");
      state.newPlayer(socket.id);

      callback({ success: true, id: socket.id });
    });

    socket.on(Types.API_GAME_CREATE, function(callback) {
      log("new game request");

      var gid = state.createGame(socket.id);
      socket.join(gid);

      callback({ success: true });
      io.in(gid).emit('game update', { game: g.getJson() });
    });

    socket.on(Types.API_GAME_JOIN, function(data, callback) {
      log("join game request: " + data.id);

      var r = state.joinGame(data.id, socket.id);
      if (r.success) {
        callback({ success: true });
        socket.join(data.id);
        io.in(gid).emit('game update', { game: g.getJson() });
      } else {
        errorResponse(callback, r.error);
      }
    });

    socket.on(Types.API_GAME_LEAVE, function(callback) {
      log("leave game request from: " + socket.id);

      var r = state.leaveGame(socket.id);
      if (r.success) {
        socket.leave(r.gid);
        callback({ success: true });
        if (!r.deleted) {
          io.in(gid).emit('game update', { game: r.json });
        }
      } else {
        errorResponse(callback, r.error);
      }
    });

    socket.on(Types.API_GAME_START, function(callback) {
      log("start game request from: " + socket.id);

      var r = state.startGame(socket.id);
      if (r.success) {
        callback({ success: true });
        io.in(gid).emit('game update', { game: r.json });
      } else {
        errorResponse(callback, r.error);
      }
    });
  });
}