// following pattern of https://github.com/jmarkstevens/ReactPatterns/blob/master/React.15/ReduxSocketIO/ui-src/store/ws.api.js

import * as Actions from './actions';
import io from 'socket.io-client';

var socket = null;

export function socketMiddleware() {
  return (next) => (action) => {

    if (socket && action.type === Actions.SEND_MOVE) {
      console.log('api send move');
      console.log(action.data);

      // socket.emit('client:GetData', {});
    }

    return next(action);
  };
}

export default function (store) {
  // socket = new io();

  socket = io();
  let myId;
  socket.emit('new player', function(response) {
    if (response.success) {
      console.log("Got my client id: " + response.id);
      myId = response.id;
    }
  });

}

