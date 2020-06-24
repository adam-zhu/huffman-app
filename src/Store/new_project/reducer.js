const initialState = {
  busy: false,
  name: "",
  description: "",
  room_width: 0,
  room_length: 0,
  room_height: 0,
  image: undefined,
  created_project_objectId: undefined,
};

export const FORM_STATE_CHANGED = "FORM_STATE_CHANGED";
export const NEW_PROJECT_CREATE_REQUEST_START =
  "NEW_PROJECT_CREATE_REQUEST_START";
export const NEW_PROJECT_CREATE_REQUEST_END = "NEW_PROJECT_CREATE_REQUEST_END";

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
      };

    case NEW_PROJECT_CREATE_REQUEST_END:
      return {
        ...state,
        created_project_objectId: action.payload,
        busy: false,
      };

    default:
      return state;
  }
};
