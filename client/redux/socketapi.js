// following pattern of https://github.com/jmarkstevens/ReactPatterns/blob/master/React.15/ReduxSocketIO/ui-src/store/ws.api.js

import * as Actions from './actions';
import io from 'socket.io-client';

var socket = null;

export function socketMiddleware() {
  return (next) => (action) => {
    if (socket && action.type.startsWith("API_")) {
      console.log("Is an API action: ", action);
      socket.emit(action.type, action.data, function(response) {
        console.log("response");
        console.log(response);
      });
    }

    return next(action);
  };
}

export default function (store) {
  socket = io();
  let myId;
  socket.emit(Actions.API_ON_CONNECT, function(response) {
    if (response.success) {
      console.log("Got my client id: " + response.id);
      myId = response.id;
    }
  });

  socket.on(Actions.API_GAME_UPDATE, function(data) {
    console.log("Got game update: ", data);
    store.dispatch(Actions.gameUpdate(data));
  });
}