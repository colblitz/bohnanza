import React from 'react';
import { exampleAction, gameSendMove, actionChanged } from '../redux/actions';
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
        <button id="game-button">New/Join Game</button>
        <div id="game">
          <pre id="game-state" value={this.props.gameState}></pre>
          <textarea id="input" value={this.props.action} onChange={(e) => this.props.actionChanged(e)}></textarea>
          <button id="submit-button" onClick={(e) => this.props.sendMove(this.props.action)}>Send</button>
        </div>
      </div>

		);
	}
}

const mapStateToProps = (state) => {
  return {
    gameState: state["gameState"],
    action: state["action"]
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendAction: () => {dispatch(exampleAction())},

    actionChanged: (e) => {
      var value = e.target.value;
      dispatch(actionChanged(value));
    },
    sendMove: (data) => {
      console.log("sending game move");
      dispatch(gameSendMove(data));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
