import * as Action from "./actions";

const defaultState = {};

const reducers = (state = defaultState, action) => {
  console.log("in reducer");
  console.log(state);
  console.log(action);
  switch (action.type) {
    case Action.EXAMPLE: {
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
