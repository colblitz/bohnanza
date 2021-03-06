const Types = require('./types.js');

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
    socket.on(Types.API_GAME_SEND_MOVE, function(data, callback) {
      log("game move from player " + socket.id + ": " + JSON.stringify(data));

      var r = state.gameMove(socket.id, data);
      console.log(r);
      if (r.success) {
        callback({ success: true, result: r.result });
        io.in(r.gid).emit(Types.API_GAME_UPDATE, { game: r.json });
      } else {
        errorResponse(callback, r.error);
      }
    });
  });
}