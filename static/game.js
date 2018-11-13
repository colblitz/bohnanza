var socket = io();
socket.emit('new player');

socket.on('message', function(data) {
  console.log(data);
});

socket.on('new game', function(data) {
  console.log("got new game message");
  $('#board').append(
    '<table id="ttt">\
      <tr>\
        <td data-x="0" data-y="0"></td>\
        <td data-x="1" data-y="0"></td>\
        <td data-x="2" data-y="0"></td>\
      </tr>\
      <tr>\
        <td data-x="0" data-y="1"></td>\
        <td data-x="1" data-y="1"></td>\
        <td data-x="2" data-y="1"></td>\
      </tr>\
      <tr>\
        <td data-x="0" data-y="2"></td>\
        <td data-x="1" data-y="2"></td>\
        <td data-x="2" data-y="2"></td>\
      </tr>\
    </table>');

  $("#board tr td").click(function() {
    var x = parseInt($(this).data("x"));
    var y = parseInt($(this).data("y"));
    console.log("clicked on (%d, %d)", x, y);
    socket.emit('clicked', {x: x, y: y});
  });
})

socket.on('game state', function(data) {
  console.log(data);
  $('td').each(function(i, obj) {
    var x = parseInt($(this).data("x"));
    var y = parseInt($(this).data("y"));

    if (x == data.last.x && y == data.last.y) {
      $(this).append(data.board[x][y]);
    }
  });
  // draw x's and o's
});

$('#game-button').click(function() {
  socket.emit("game button clicked");
  return false;
});

$('#button').click(function() {
  console.log("clicked button");
  socket.emit('clicked button');
  return false;
});
    //   socket.emit('chat message', $('#m').val());
    //   $('#m').val('');
    //   return false;
    // });
