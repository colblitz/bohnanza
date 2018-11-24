import asdf from '.';
import Balnk from './';
import React from 'react';
import { exampleAction } from '../redux/actions.js';
import { connect } from 'react-redux';

// import PropTypes from 'prop-types';

// const propTypes = {

// }

class Homepage extends React.Component {
  // onClick = () => {
  //   console.log('on click handler');
  //   this.props.sendAction();
  // }


	render() {
		return (
      <div>Homepage </div>
		);
	}
}

const mapStateToProps = (state) => {
  return {

  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendAction: () => {dispatch(exampleAction())}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
