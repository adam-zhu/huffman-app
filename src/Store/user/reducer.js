const initialState = {
  emailInputValue: "",
  passwordInputValue: "",
  isUserRegistrationRequestBusy: false,
  user: undefined,
  userRegistrationError: undefined,
};

export const EMAIL_INPUT_VALUE_CHANGE = "EMAIL_INPUT_VALUE_CHANGE";
export const PASSWORD_INPUT_VALUE_CHANGE = "PASSWORD_INPUT_VALUE_CHANGE";
export const USER_REGISTRATION_REQUEST_START =
  "USER_REGISTRATION_REQUEST_START";
export const USER_REGISTRATION_REQUEST_SUCCESS =
  "USER_REGISTRATION_REQUEST_SUCCESS";
export const USER_REGISTRATION_REQUEST_ERROR =
  "USER_REGISTRATION_REQUEST_ERROR";
export const USER_REGISTRATION_REQUEST_ERROR_DISMISSED =
  "USER_REGISTRATION_REQUEST_ERROR_DISMISSED";

export default (state = initialState, action) => {
  switch (action.type) {
    case EMAIL_INPUT_VALUE_CHANGE:
      return {
        ...state,
        emailInputValue: action.payload,
      };

    case PASSWORD_INPUT_VALUE_CHANGE:
      return {
        ...state,
        passwordInputValue: action.payload,
      };

    case USER_REGISTRATION_REQUEST_START:
      return {
        ...state,
        isUserRegistrationRequestBusy: true,
      };

    case USER_REGISTRATION_REQUEST_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isUserRegistrationRequestBusy: false,
      };

    case USER_REGISTRATION_REQUEST_ERROR:
      return {
        ...state,
        isUserRegistrationRequestBusy: false,
        userRegistrationError: action.payload,
      };

    case USER_REGISTRATION_REQUEST_ERROR_DISMISSED:
      return {
        ...state,
        userRegistrationError: undefined,
      };

    default:
      return state;
  }
};
