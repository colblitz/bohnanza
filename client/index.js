import React from 'react';
import ReactDOM from 'react-dom';
import './style/global.scss';
import Homepage from './components/homepage.jsx';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.js';

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