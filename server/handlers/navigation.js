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
    socket.on('new player', function(callback) {
      log("new player");
      state.newPlayer(socket.id);

      callback({ success: true, id: socket.id });
    });

    socket.on('new game request', function(callback) {
      log("new game request");

      var gid = state.createGame(socket.id);
      socket.join(gid);

      callback({ success: true });
      io.in(gid).emit('game update', { game: g.getJson() });
    });

    socket.on('join game request', function(data, callback) {
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

    socket.on('leave game request', function(callback) {
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

    socket.on('start game request', function(callback) {
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