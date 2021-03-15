const initialState = {
  first_name_input_value: "",
  last_name_input_value: "",
  email_input_value: "",
  phone_input_value: "",
  password_input_value: "",
  data: undefined,
  is_registration_request_busy: false,
  is_signin_request_busy: false,
  is_signout_request_busy: false,
  is_set_has_active_connection_request_busy: false,
  is_phone_submission_request_busy: false,
};

export const FIRST_NAME_INPUT_VALUE_CHANGE =
  "user/FIRST_NAME_INPUT_VALUE_CHANGE";
export const LAST_NAME_INPUT_VALUE_CHANGE = "user/LAST_NAME_INPUT_VALUE_CHANGE";
export const EMAIL_INPUT_VALUE_CHANGE = "user/EMAIL_INPUT_VALUE_CHANGE";
export const PHONE_INPUT_VALUE_CHANGE = "user/PHONE_INPUT_VALUE_CHANGE";
export const PASSWORD_INPUT_VALUE_CHANGE = "user/PASSWORD_INPUT_VALUE_CHANGE";
export const USER_REGISTRATION_REQUEST_START =
  "user/USER_REGISTRATION_REQUEST_START";
export const USER_REGISTRATION_REQUEST_END =
  "user/USER_REGISTRATION_REQUEST_END";
export const USER_EMAIL_VERIFIED = "user/USER_EMAIL_VERIFIED";
export const SIGNIN_REQUEST_START = "user/SIGNIN_REQUEST_START";
export const SIGNIN_REQUEST_END = "user/SIGNIN_REQUEST_END";
export const SIGNOUT_REQUEST_START = "user/SIGNOUT_REQUEST_START";
export const SIGNOUT_REQUEST_END = "user/SIGNOUT_REQUEST_END";
export const RESTORE_USER_SESSION = "user/RESTORE_USER_SESSION";
export const SET_HAS_ACTIVE_CONNECTION_REQUEST_START =
  "user/SET_HAS_ACTIVE_CONNECTION_REQUEST_START";
export const SET_HAS_ACTIVE_CONNECTION_REQUEST_END =
  "user/SET_HAS_ACTIVE_CONNECTION_REQUEST_END";
export const SET_USER_DATA = "user/SET_USER_DATA";
export const PHONE_SUBMIT_REQUEST_START = "user/PHONE_SUBMIT_REQUEST_START";
export const PHONE_SUBMIT_REQUEST_END = "user/PHONE_SUBMIT_REQUEST_END";

export default (state = initialState, action) => {
  switch (action.type) {
    case FIRST_NAME_INPUT_VALUE_CHANGE:
      return {
        ...state,
        first_name_input_value: action.payload,
      };

    case LAST_NAME_INPUT_VALUE_CHANGE:
      return {
        ...state,
        last_name_input_value: action.payload,
      };

    case EMAIL_INPUT_VALUE_CHANGE:
      return {
        ...state,
        email_input_value: action.payload,
      };

    case PHONE_INPUT_VALUE_CHANGE:
      return {
        ...state,
        phone_input_value: action.payload,
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
        is_signout_request_busy: false,
        data: undefined,
      };

    case SET_HAS_ACTIVE_CONNECTION_REQUEST_START:
      return {
        ...state,
        is_set_has_active_connection_request_busy: true,
      };

    case SET_HAS_ACTIVE_CONNECTION_REQUEST_END:
      return {
        ...state,
        is_set_has_active_connection_request_busy: false,
      };

    case SET_USER_DATA:
      return {
        ...state,
        data: action.payload,
      };

    case PHONE_SUBMIT_REQUEST_START:
      return {
        ...state,
        is_phone_submission_request_busy: true,
      };

    case PHONE_SUBMIT_REQUEST_END:
      return {
        ...state,
        is_phone_submission_request_busy: false,
      };

    default:
      return state;
  }
};
