export const EXAMPLE = "EXAMPLE_ACTION";
export const SEND_MOVE = "SEND_MOVE";

export const exampleAction = () => ({
  type: EXAMPLE
});

export const sendMove = (data) => ({
  type: SEND_MOVE,
  data
});