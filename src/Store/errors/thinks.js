import { ERROR_OCCURRED, ERRORS_DISMISSED } from "./reducer";

export const add_app_error = (error_message) => ({
  type: ERROR_OCCURRED,
  payload: error_message,
});

export const clear_app_errors = () => ({
  type: ERRORS_DISMISSED,
});
