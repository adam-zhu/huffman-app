const initialState = {
  busy: false,
  data: undefined,
};

export const PRODUCTS_REQUEST_START = "products/PRODUCTS_REQUEST_START";
export const PRODUCTS_REQUEST_END = "products/PRODUCTS_REQUEST_END";

export default (state = initialState, action) => {
  switch (action.type) {
    case PRODUCTS_REQUEST_START:
      return {
        ...state,
        busy: true,
      };

    case PRODUCTS_REQUEST_END:
      return {
        ...state,
        busy: false,
        data: action.payload,
      };

    default:
      return state;
  }
};
