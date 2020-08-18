const initialState = {
  busy: false,
  name: "",
  description: "",
  room_width: 0,
  room_length: 0,
  room_height: 0,
  package_objectId: "",
  project_images: [],
  project_cancelled: undefined,
};

export const FORM_STATE_CHANGED = "new_project/FORM_STATE_CHANGED";
export const NEW_PROJECT_CREATE_REQUEST_START =
  "new_project/NEW_PROJECT_CREATE_REQUEST_START";
export const NEW_PROJECT_CREATE_REQUEST_END =
  "new_project/NEW_PROJECT_CREATE_REQUEST_END";
export const NEW_PROJECT_CANCELLATION_REQUEST_START =
  "new_project/NEW_PROJECT_CANCELLATION_REQUEST_START";
export const NEW_PROJECT_CANCELLATION_REQUEST_END =
  "new_project/NEW_PROJECT_CANCELLATION_REQUEST_END";

export default (state = initialState, action) => {
  switch (action.type) {
    case FORM_STATE_CHANGED:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    case NEW_PROJECT_CREATE_REQUEST_START:
      return {
        ...state,
        busy: true,
        project_cancelled: undefined,
      };

    case NEW_PROJECT_CREATE_REQUEST_END:
      return {
        ...state,
        busy: false,
      };

    case NEW_PROJECT_CANCELLATION_REQUEST_START:
      return {
        ...state,
        busy: true,
      };

    case NEW_PROJECT_CANCELLATION_REQUEST_END:
      return {
        ...state,
        busy: false,
        project_cancelled: action.payload.success,
      };

    default:
      return state;
  }
};
