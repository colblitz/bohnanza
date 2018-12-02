exports = module.exports = function(io, state) {
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
    }

    // message methods
    socket.on('game move', function(data, callback) {
      log("game move from player " + socket.id + ": " + JSON.stringify(data));

      var r = state.gameMove(socket.id, data);
      if (r.success) {
        callback({ success: true, result: r.results });
        io.in(gid).emit('game update', { game: r.json });
      } else {
        errorResponse(callback, r.error);
      }
    });
  });
}