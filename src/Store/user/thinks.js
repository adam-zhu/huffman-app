import {
  FIRST_NAME_INPUT_VALUE_CHANGE,
  LAST_NAME_INPUT_VALUE_CHANGE,
  EMAIL_INPUT_VALUE_CHANGE,
  PASSWORD_INPUT_VALUE_CHANGE,
  USER_REGISTRATION_REQUEST_START,
  USER_REGISTRATION_REQUEST_END,
  USER_EMAIL_VERIFIED,
  SIGNIN_REQUEST_START,
  SIGNIN_REQUEST_END,
  SIGNOUT_REQUEST_START,
  SIGNOUT_REQUEST_END,
  RESTORE_USER_SESSION,
} from "./reducer";
import { add_app_error } from "Store/errors/thinks";

export const check_for_current_session = () => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  Parse.User.enableUnsafeCurrentUser();

  if (Parse.User.current()) {
    const cached_user_data = Parse.User.current().toJSON();
    const query = new Parse.Query(Parse.User);

    try {
      const user_data = await query.get(cached_user_data.objectId);

      return dispatch({
        type: RESTORE_USER_SESSION,
        payload: user_data.toJSON(),
      });
    } catch (e) {
      return dispatch(add_app_error(e.message));
    }
  }
};

export const set_input_value = (type) => (payload) => {
  switch (type) {
    case "first_name":
      return {
        type: FIRST_NAME_INPUT_VALUE_CHANGE,
        payload,
      };

    case "last_name":
      return {
        type: LAST_NAME_INPUT_VALUE_CHANGE,
        payload,
      };

    case "email":
      return {
        type: EMAIL_INPUT_VALUE_CHANGE,
        payload,
      };

    case "password":
      return {
        type: PASSWORD_INPUT_VALUE_CHANGE,
        payload,
      };

    default:
      return {};
  }
};

export const register_user = () => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const {
    first_name_input_value,
    last_name_input_value,
    email_input_value,
    password_input_value,
    user,
  } = getState().user;

  dispatch({
    type: USER_REGISTRATION_REQUEST_START,
  });

  try {
    const new_user = new Parse.User();

    new_user.set("first_name", first_name_input_value);
    new_user.set("last_name", last_name_input_value);
    new_user.set("username", email_input_value);
    new_user.set("email", email_input_value);
    new_user.set("password", password_input_value);

    const created_user = await new_user.signUp();

    dispatch({
      type: USER_REGISTRATION_REQUEST_END,
      payload: created_user.toJSON(),
    });
  } catch (e) {
    dispatch({
      type: USER_REGISTRATION_REQUEST_END,
      payload: user,
    });
    dispatch(add_app_error(e.message));
  }
};

export const check_email_verification = () => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const { objectId } = getState().user.data;
  const User = new Parse.User();
  const query = new Parse.Query(User);

  try {
    const user_data = await query.get(objectId);

    if (user_data.get("emailVerified") === true) {
      dispatch({
        type: USER_EMAIL_VERIFIED,
      });

      dispatch(log_user_in());
    } else {
      dispatch(add_app_error("Email not yet verified."));
    }
  } catch (e) {
    dispatch(add_app_error(e.message));
  }
};

export const log_user_in = () => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const { email_input_value, password_input_value, data } = getState().user;

  dispatch({
    type: SIGNIN_REQUEST_START,
  });

  try {
    const logged_in_user = await Parse.User.logIn(
      email_input_value,
      password_input_value
    );

    dispatch({
      type: SIGNIN_REQUEST_END,
      payload: logged_in_user.toJSON(),
    });
  } catch (e) {
    dispatch({
      type: SIGNIN_REQUEST_END,
      payload: data,
    });

    dispatch(add_app_error(e.message));
  }
};

export const log_user_out = (history) => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const { user } = getState().user;

  dispatch({
    type: SIGNOUT_REQUEST_START,
  });

  try {
    await Parse.User.logOut();

    dispatch({
      type: SIGNOUT_REQUEST_END,
    });

    history.push("/");
  } catch (e) {
    dispatch({
      type: SIGNOUT_REQUEST_END,
      payload: user,
    });
    dispatch(add_app_error(e.message));
  }
};

export const send_password_reset_email = ({
  success_callback,
  failure_callback,
}) => async (dispatch, getState, { Parse, StripePromise }) => {
  const { email_input_value } = getState().user;

  try {
    await Parse.User.requestPasswordReset(email_input_value);

    success_callback();
  } catch (e) {
    dispatch(add_app_error(e.message));
    failure_callback();
  }
};

export const resend_verification_email = ({
  success_callback,
  failure_callback,
}) => async (dispatch, getState, { Parse, StripePromise }) => {
  const { username } = getState().user.data;
  const on_failure = (message) => {
    dispatch(add_app_error(message));
    failure_callback();
  };

  try {
    const response = await fetch(
      "https://letsdecorate.back4app.io/verificationEmailRequest",
      {
        method: "POST",
        headers: {
          "X-Parse-Application-Id": "W4f2B4g4iM635LZKAdf4adf65ZWEZ2f9bMXR5x59",
          "X-Parse-REST-API-Key": "6eARd0rDu5jxU1XcSRPS8irv9DcSbJRCGgMAJrRo",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
        }),
      }
    );
    const result = await response.json();

    if (result.error) {
      return on_failure(result.error);
    }

    success_callback();
  } catch (e) {
    on_failure(e.message);
  }
};
