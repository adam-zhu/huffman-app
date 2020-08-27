const initial_state = {
  add_package_request_busy: false,
  delete_package_request_busy: false,
  package_deleted: undefined,
};

export const ADD_PACKAGE_REQUEST_START =
  "more_consultations/ADD_PACKAGE_REQUEST_START";
export const ADD_PACKAGE_REQUEST_END =
  "more_consultations/ADD_PACKAGE_REQUEST_END";
export const DELETE_PACKAGE_REQUEST_START =
  "more_consultations/DELETE_PACKAGE_REQUEST_START";
export const DELETE_PACKAGE_REQUEST_END =
  "more_consultations/DELETE_PACKAGE_REQUEST_END";

export default (state = initial_state, action) => {
  switch (action.type) {
    case ADD_PACKAGE_REQUEST_START:
      return {
        ...state,
        add_package_request_busy: true,
      };

    case ADD_PACKAGE_REQUEST_END:
      return {
        ...state,
        add_package_request_busy: false,
      };

    case DELETE_PACKAGE_REQUEST_START:
      return {
        ...state,
        delete_package_request_busy: true,
      };

    case DELETE_PACKAGE_REQUEST_END:
      return {
        ...state,
        delete_package_request_busy: false,
        package_deleted: action.payload,
      };

    default:
      return state;
  }
};
