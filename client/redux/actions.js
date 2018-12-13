// Action Types
export const EXAMPLE = "EXAMPLE_ACTION";
export const ACTION_CHANGED = "ACTION_CHANGED";

// Actions

export const exampleAction = () => ({
  type: EXAMPLE
});

export const actionChanged = (value) => ({
  type: ACTION_CHANGED,
  value
});

// API Action Types (keep in sync with /server/handlers/types.js)
export const API_ON_CONNECT     = "API_ON_CONNECT";
export const API_GAME_CREATE    = "API_GAME_CREATE";
export const API_GAME_JOIN      = "API_GAME_JOIN";
export const API_GAME_LEAVE     = "API_GAME_LEAVE";
export const API_GAME_START     = "API_GAME_START";
export const API_GAME_SEND_MOVE = "API_GAME_SEND_MOVE";
export const API_GAME_UPDATE    = "API_GAME_UPDATE";

// API Actions

export const onConnect = () => ({ type: API_ON_CONNECT });
export const gameCreate = () => ({ type: API_GAME_CREATE });
export const gameJoin = (data) => ({ type: API_GAME_JOIN, data });
export const gameLeave = () => ({ type: API_GAME_LEAVE });
export const gameStart = () => ({ type: API_GAME_START });
export const gameSendMove = (data) => ({ type: API_GAME_SEND_MOVE, data });
export const gameUpdate = (data) => ({ type: API_GAME_UPDATE, data });