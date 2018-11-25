import React from 'react';
import { exampleAction } from '../redux/actions';
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
