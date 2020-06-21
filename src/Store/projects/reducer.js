const initialState = {
  loading: false,
  data: undefined,
};

export const PROJECTS_GET_REQUEST_START = "PROJECTS_GET_REQUEST_START";
export const PROJECTS_GET_REQUEST_END = "PROJECTS_GET_REQUEST_END";

export default (state = initialState, action) => {
  switch (action.type) {
    case PROJECTS_GET_REQUEST_START:
      return {
        ...state,
        loading: true,
      };

    case PROJECTS_GET_REQUEST_END:
      return {
        ...state,
        data: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};
