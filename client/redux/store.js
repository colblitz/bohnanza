import React from "react";
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from "./reducers.js";
import startApi, {socketMiddleware} from './socketapi';
import { createLogger } from 'redux-logger';

const initialState = {
  gameState: {},
  action: "{}",
}

// const stateTransformer = (state) => { return state.toJS(); };
const stateTransformer = (state) => { return state; };
const loggerMiddleware = createLogger({
  stateTransformer,
  diff: true
});

const middleware = [socketMiddleware, loggerMiddleware];

// from https://github.com/zalmoxisus/redux-devtools-extension#12-advanced-store-setup
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, initialState, composeEnhancers(
  applyMiddleware(...middleware)
));

// https://github.com/jmarkstevens/ReactPatterns/blob/master/React.15/ReduxSocketIO/ui-src/store/App.Store.js
startApi(store);

export default store;