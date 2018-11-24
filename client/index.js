import React from 'react';
import ReactDOM from 'react-dom';
import './style/global.scss';
import io from 'socket.io-client';
import Homepage from './components/homepage.jsx';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';

let socket = io();
let myId;
socket.emit('new player', function(response) {
  if (response.success) {
    console.log("Got my client id: " + response.id);
    myId = response.id;
  }
});

const App = () => {
  return (
  	<Switch>
  		<Route exact path='/' component={Homepage}/>
  	</Switch>
  );
}
ReactDOM.render(
  <Provider store={store}>
  	<BrowserRouter>
    	<App />
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root')
);

// var updateGameState = function(json) {
//   // TODO: replace this with angular or react or whatever
//   console.log("update game state: ", json);

//   var inGame = !!json;

//   $('#leave-game-button').toggle(inGame);
//   $('#new-game-button').toggle(!inGame);
//   $('#join-game-button').toggle(!inGame);
//   $('#join-game-id').toggle(!inGame);

//   if (inGame) {
//     $('#game').toggle(true);
//     $('#game-state').html(JSON.stringify(json, undefined, 2));
//     $('#start-game-button').toggle(inGame && !json.isStarted);

//     $('#draw1-game-button').toggle(inGame && json.isStarted);
//     $('#draw2-game-button').toggle(inGame && json.isStarted);

//     $('my-points').html(json.points[myId]);
//   } else {
//     $('#game').toggle(false);
//     $('#start-game-button').toggle(false);

//     $('#draw1-game-button').toggle(false);
//     $('#draw2-game-button').toggle(false);
//   }
// };

// // var updateButtonState = function(inGame, gameStarted = false) {
// //   $('#leave-game-button').toggle(inGame);
// //   $('#start-game-button').toggle(inGame && !gameStarted);
// //   $('#new-game-button').toggle(!inGame);
// //   $('#join-game-button').toggle(!inGame);
// //   $('#join-game-id').toggle(!inGame);
// // }

// $('#new-game-button').click(function() {
//   console.log("client clicked new game button");
//   socket.emit('new game request', function(response) {
//     if (!response.success) { console.log(response.error); }
//   });
//   // TODO: what is this for?
//   return false;
// });

// $('#join-game-button').click(function() {
//   console.log("client clicked join game button");
//   var id = $('#join-game-id').val();
//   socket.emit('join game request', {id: id}, function(response) {
//     if (!response.success) { console.log(response.error); }
//   });
//   return false;
// });

// $('#leave-game-button').click(function() {
//   console.log("client clicked leave game button");
//   socket.emit('leave game request', function(response) {
//     if (!response.success) { console.log(response.error); }
//   });
//   return false;
// });

// $('#start-game-button').click(function() {
//   console.log("client clicked start game button");
//   socket.emit('start game request', function(response) {
//     if (!response.success) { console.log(response.error); }
//   });
//   return false;
// });

// $('#draw1-game-button').click(function() {
//   console.log("client clicked draw 1 game button");
//   socket.emit('game move', { draw: 1 }, function(response) {
//     if (!response.success) { console.log(response.error); }
//     else { console.log("Drew: ", response.drawn); }
//   });
//   return false;
// });

// $('#draw2-game-button').click(function() {
//   console.log("client clicked draw 2 game button");
//   socket.emit('game move', { draw: 2 }, function(response) {
//     if (!response.success) { console.log(response.error); }
//     else { console.log("Drew: ", response.drawn); }
//   });
//   return false;
// });

// socket.on('game update', function(data) {
//   updateGameState(data.game);
// });