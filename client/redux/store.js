import React from "react";
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from "./reducers.js";
import startApi, {socketMiddleware} from './socketapi';

// const store = createStore(
//   combineReducers({
//     state: reducers
//   }),
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

// const middleware = [ReduxThunk, logger]
const middleware = [socketMiddleware];

// from https://github.com/zalmoxisus/redux-devtools-extension#12-advanced-store-setup
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, /* preloadedState, */ composeEnhancers(
  applyMiddleware(...middleware)
));

// https://github.com/jmarkstevens/ReactPatterns/blob/master/React.15/ReduxSocketIO/ui-src/store/App.Store.js
startApi(store);

export default store;