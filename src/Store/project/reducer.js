const initialState = {
  consultation_creation_busy: false,
};

export const CONSULTATION_CREATE_REQUEST_START =
  "project/CONSULTATION_CREATE_REQUEST_START";
export const CONSULTATION_CREATE_REQUEST_END =
  "project/CONSULTATION_CREATE_REQUEST_END";

export default (state = initialState, action) => {
  switch (action.type) {
    case CONSULTATION_CREATE_REQUEST_START:
      return {
        ...state,
        consultation_creation_busy: true,
      };

    case CONSULTATION_CREATE_REQUEST_END:
      return {
        ...state,
        consultation_creation_busy: false,
      };

    default:
      return state;
  }
};
