const initialState = {
  loading: false,
  data: undefined,
  consutlation_creation_busy: false,
  new_consultation: undefined,
};

export const PROJECT_GET_REQUEST_START = "PROJECT_GET_REQUEST_START";
export const PROJECT_GET_REQUEST_END = "PROJECT_GET_REQUEST_END";
export const CONSULTATION_CREATE_REQUEST_START =
  "CONSULTATION_CREATE_REQUEST_START";
export const CONSULTATION_CREATE_REQUEST_END =
  "CONSULTATION_CREATE_REQUEST_END";

export default (state = initialState, action) => {
  switch (action.type) {
    case PROJECT_GET_REQUEST_START:
      return {
        ...state,
        loading: true,
      };

    case PROJECT_GET_REQUEST_END:
      return {
        ...state,
        data: action.payload,
        loading: false,
      };

    case CONSULTATION_CREATE_REQUEST_START:
      return {
        ...state,
        consutlation_creation_busy: true,
      };

    case CONSULTATION_CREATE_REQUEST_END:
      return {
        ...state,
        new_consultation: action.payload,
        consutlation_creation_busy: false,
      };

    default:
      return state;
  }
};
