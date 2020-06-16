const initialState = {
  email_input_value: "",
  password_input_value: "",
  is_user_registration_request_busy: false,
  user: undefined,
  user_registration_error: undefined,
};

export const EMAIL_INPUT_VALUE_CHANGE = "EMAIL_INPUT_VALUE_CHANGE";
export const PASSWORD_INPUT_VALUE_CHANGE = "PASSWORD_INPUT_VALUE_CHANGE";
export const USER_REGISTRATION_REQUEST_START =
  "USER_REGISTRATION_REQUEST_START";
export const USER_REGISTRATION_REQUEST_END = "USER_REGISTRATION_REQUEST_END";

export default (state = initialState, action) => {
  switch (action.type) {
    case EMAIL_INPUT_VALUE_CHANGE:
      return {
        ...state,
        email_input_value: action.payload,
      };

    case PASSWORD_INPUT_VALUE_CHANGE:
      return {
        ...state,
        password_input_value: action.payload,
      };

    case USER_REGISTRATION_REQUEST_START:
      return {
        ...state,
        is_user_registration_request_busy: true,
      };

    case USER_REGISTRATION_REQUEST_END:
      return {
        ...state,
        user: action.payload,
        is_user_registration_request_busy: false,
      };

    default:
      return state;
  }
};
