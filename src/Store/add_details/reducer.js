const initial_state = {
  busy: false,
  room_width: 0,
  room_length: 0,
  room_height: 0,
  project_images: [],
};

export const FORM_STATE_CHANGED = "add_details/FORM_STATE_CHANGED";
export const DETAILS_SAVE_REQUEST_START =
  "add_details/DETAILS_SAVE_REQUEST_START";
export const DETAILS_SAVE_REQUEST_END = "add_details/DETAILS_SAVE_REQUEST_END";
export const RESET_REDUCER_STATE = "add_details/RESET_REDUCER_STATE";

export default (state = initial_state, action) => {
  switch (action.type) {
    case FORM_STATE_CHANGED:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    case DETAILS_SAVE_REQUEST_START:
      return {
        ...state,
        busy: true,
        project_cancelled: undefined,
      };

    case DETAILS_SAVE_REQUEST_END:
      return {
        ...state,
        busy: false,
      };

    case RESET_REDUCER_STATE:
      return {
        ...initial_state,
      };

    default:
      return state;
  }
};
