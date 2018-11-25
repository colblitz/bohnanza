import * as Action from "./actions";

const defaultState = {};

const reducers = (state = defaultState, action) => {
  switch (Action.type) {
    case action.EXAMPLE: {
      return {
        ...state,
        test: "hi"
      };
    }
    default:
      return state;
  }
};

export default reducers;
