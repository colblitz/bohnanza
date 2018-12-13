import * as Actions from "./actions";

const defaultState = {};

const reducers = (state = defaultState, action) => {
  switch (action.type) {
    case Actions.EXAMPLE: {
      return {
        ...state,
        test: "hi"
      };
    }
    case Actions.ACTION_CHANGED: {
      return Object.assign({}, state, {action: action.value});
    }

    // API Actions
    case Actions.API_GAME_UPDATE: {
      return Object.assign({}, state, {gameState: action.data});
    }
    default:
      return state;
  }
};

export default reducers;
