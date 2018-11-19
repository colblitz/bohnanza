var socket = io();
socket.emit('new player');

var updateGameState = function(json) {
  console.log("update game state: ", json);
  if (json) {
    $('#game-state').html(JSON.stringify(json, undefined, 2));
  } else {
    $('#game-state').empty();
  }
};

var updateButtonState = function(inGame) {
  $('#leave-game-button').toggle(inGame);
  $('#new-game-button').toggle(!inGame);
  $('#join-game-button').toggle(!inGame);
  $('#join-game-id').toggle(!inGame);
}

$('#new-game-button').click(function() {
  console.log("client clicked new game button");
  socket.emit('new game request', function(response) {
    if (response.success) {
      updateGameState(response.game);
      updateButtonState(true);
    } else {
      console.log("error creating game");
    }
  });
  // TODO: what is this for?
  return false;
});

$('#join-game-button').click(function() {
  console.log("client clicked join game button");
  var id = $('#join-game-id').val();
  socket.emit('join game request', {id: id}, function(response) {
    if (response.success) {
      console.log("successfully joined game " + id);
      updateGameState(response.game);
      updateButtonState(true);
    } else {
      console.log(response.error);
    }
  });
  return false;
});

$('#leave-game-button').click(function() {
  console.log("client clicked leave game button");
  socket.emit('leave game request', function(response) {
    if (response.success) {
      console.log("successfully left game");
      updateGameState();
      updateButtonState(false);
    } else {
      console.log(response.error);
    }
  });
  return false;
});

socket.on('game update', function(data) {
  updateGameState(data.game);
});