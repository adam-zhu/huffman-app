const initialState = {
  busy: false,
  data: undefined,
};

export const PACKAGES_REQUEST_START = "packages/PACKAGES_REQUEST_START";
export const PACKAGES_REQUEST_END = "packages/PACKAGES_REQUEST_END";

export default (state = initialState, action) => {
  switch (action.type) {
    case PACKAGES_REQUEST_START:
      return {
        ...state,
        busy: true,
      };

    case PACKAGES_REQUEST_END:
      return {
        ...state,
        busy: false,
        data: action.payload,
      };

    default:
      return state;
  }
};
