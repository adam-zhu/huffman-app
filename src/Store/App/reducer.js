const initialState = {
  ion_content_ref: undefined,
};

export const MAIN_ION_CONTENT_MOUNTED = "MAIN_ION_CONTENT_MOUNTED";
export const MAIN_ION_CONTENT_UNMOUNTED = "MAIN_ION_CONTENT_UNMOUNTED";

export default (state = initialState, action) => {
  switch (action.type) {
    case MAIN_ION_CONTENT_MOUNTED:
      return {
        ...state,
        ion_content_ref: action.payload,
      };

    case MAIN_ION_CONTENT_UNMOUNTED:
      return {
        ...state,
        ion_content_ref: undefined,
      };

    default:
      return state;
  }
};
