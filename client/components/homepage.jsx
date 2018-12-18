import React from 'react';
import { exampleAction, gameSendMove, actionChanged, gameJoin, gameCreate, gameStart } from '../redux/actions';
import { connect } from 'react-redux';

// import PropTypes from 'prop-types';

const propTypes = {
};

class Homepage extends React.Component {
	render() {
    const test = 'yay';
		return (
      <div>
        Homepage
        <button id="game-button" onClick={(e) => this.props.newGame()}>New Game</button>
        <input type="text" id="join-game-id"></input>
        <button id="game-button2" onClick={(e) => this.props.joinGame()}>Join Game</button>
        <button id="game-button3" onClick={(e) => this.props.startGame()}>Start Game</button>
        <div id="game">
          <pre id="game-state">{this.props.gameState}</pre>
          <textarea id="input" value={this.props.action} onChange={(e) => this.props.actionChanged(e)}></textarea>
          <button id="submit-button" onClick={(e) => this.props.sendMove()}>Send</button>
        </div>
      </div>

		);
	}
}

const mapStateToProps = (state) => {
  console.log("gamestate is: ");
  console.log(state["gameState"]);
  return {
    gameState: JSON.stringify(state["gameState"], undefined, 2),
    action: state["action"]
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendAction: () => {dispatch(exampleAction())},

    newGame: () => {
      dispatch(gameCreate({}));
    },
    joinGame: () => {
      var id = $('#join-game-id').val();
      console.log("tryingn to join game ", id);
      dispatch(gameJoin({id: id}));
    },
    startGame: () => {
      dispatch(gameStart({}));
    },
    actionChanged: (e) => {
      var value = e.target.value;
      dispatch(actionChanged(value));
    },
    sendMove: () => {
      var action = $('#input').val();
      console.log(typeof action);
      console.log("sending game move with action: ", JSON.parse(action));
      dispatch(gameSendMove(JSON.parse(action)));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
