const initial_state = [];

export const ERROR_OCCURRED = "ERROR_OCCURRED";
export const ERRORS_DISMISSED = "ERRORS_DISMISSED";

export default (state = initial_state, action) => {
  switch (action.type) {
    case ERROR_OCCURRED:
      return state.concat([action.payload]);

    case ERRORS_DISMISSED:
      return [];

    default:
      return state;
  }
};
