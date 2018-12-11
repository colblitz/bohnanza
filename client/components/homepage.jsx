import React from 'react';
import { exampleAction, sendMove } from '../redux/actions';
import { connect } from 'react-redux';

// import PropTypes from 'prop-types';

const propTypes = {
};

class Homepage extends React.Component {
  // onClick = () => {
  //   console.log('on click handler');
  //   this.props.sendAction();
  // }


	render() {
    const test = 'yay';
		return (
      <div>
        Homepage
        <button id="game-button">New/Join Game</button>
        <div id="game">
          <pre id="game-state"></pre>
          <textarea id="input"></textarea>
          <button id="submit-button" onClick={(e) => this.props.send()}>Send</button>
        </div>
      </div>

		);
	}
}

const mapStateToProps = (state) => {
  return {

  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendAction: () => {dispatch(exampleAction())},
    send: () => {
      console.log("lkjalskjf lkajs el fkj ");
      dispatch(sendMove())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
