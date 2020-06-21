const initialState = {
  email_input_value: "",
  password_input_value: "",
  data: undefined,
  is_registration_request_busy: false,
  is_signin_request_busy: undefined,
  is_signout_request_busy: undefined,
};

export const EMAIL_INPUT_VALUE_CHANGE = "EMAIL_INPUT_VALUE_CHANGE";
export const PASSWORD_INPUT_VALUE_CHANGE = "PASSWORD_INPUT_VALUE_CHANGE";
export const USER_REGISTRATION_REQUEST_START =
  "USER_REGISTRATION_REQUEST_START";
export const USER_REGISTRATION_REQUEST_END = "USER_REGISTRATION_REQUEST_END";
export const USER_EMAIL_VERIFIED = "USER_EMAIL_VERIFIED";
export const SIGNIN_REQUEST_START = "SIGNIN_REQUEST_START";
export const SIGNIN_REQUEST_END = "SIGNIN_REQUEST_END";
export const SIGNOUT_REQUEST_START = "SIGNIN_REQUEST_START";
export const SIGNOUT_REQUEST_END = "SIGNOUT_REQUEST_END";
export const RESTORE_USER_SESSION = "RESTORE_USER_SESSION";

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
        is_registration_request_busy: true,
      };

    case USER_REGISTRATION_REQUEST_END:
      return {
        ...state,
        data: action.payload,
        is_registration_request_busy: false,
      };

    case USER_EMAIL_VERIFIED:
      return {
        ...state,
        data: {
          ...state.data,
          emailVerified: true,
        },
      };

    case SIGNIN_REQUEST_START:
      return {
        ...state,
        is_signin_request_busy: true,
      };

    case SIGNIN_REQUEST_END:
      return {
        ...state,
        data: action.payload,
        is_signin_request_busy: false,
      };

    case SIGNOUT_REQUEST_START:
      return {
        ...state,
        is_signout_request_busy: true,
      };

    case SIGNOUT_REQUEST_END:
      return {
        ...state,
        data: undefined,
        is_signout_request_busy: false,
      };

    case RESTORE_USER_SESSION:
      return {
        ...state,
        data: action.payload,
      };

    default:
      return state;
  }
};
