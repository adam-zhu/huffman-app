import {
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

/*
  You can only talk to Redux using its special walkie-talkie `dispatch`.
  `dispatch` normally only accepts `actions`.
  `actions` are just regular ass js objects (ppl also call them POJOs [plain old javascript objects] this term exists bc ppl are that confused about js):
  ```
  const an_action = {
    type: A_TYPE_HERE_SO_THE_REDUCER_KNOWS_WHAT_KINDA_MESSAGE_THIS_IS,
    payload: some_data_or_maybe_not_whatever_u_wanna_do_so_ur_reducer_can_fuk_wit_it
  };
  ```
  
  There isn't room in that pattern to do something "async" (really just means in parallel).
  So there is a package added called `redux-thunk`.

  The only important-ish thing to know is that regular "thinks" (referred to as "action creators" by the community) are just functions that take a piece of data, construct an action, and return that object.
  It doesn't have to take data if it doesn't need to, like if the think is "button_clicked" or something. But if it's like "option_selected", then you prob need data that indicates which option was selected.
  That's why when you `dispatch` a think from within a `react` component file, you run the think function first `dispatch(think(data))`.

  The reason why I like calling it a "think" is because its job is to:
    - take data from the user (user's input into the UI)
    - deduce some stuff based on it, like how to construct the action that's gonna get sent by the dispatch walkie-talkie
    - dispatch the action to the redux store (which automatically uses those SPECIAL_ACTION_TYPE things to know which reducer to give it to so you don't have to worry about it at all)

  A "thunk" is basically like a future tense think. Rather than being a function that takes data and returns a POJO action, it returns another function. We can put code inside that interior function that makes network requests.
  
  A `redux-thunk` thunk is a function that returns a function with a special set of arguments: (dispatch, getState, ParseAPI) => { ... }
  
  Since we have `redux-thunk` installed, `redux` knows that when `dispatch` gets a message that's not a POJO action but a function, then to run that function passing it (dispatch, getState, ParseAPI).
  If you just write the function signature like the example, then it will know what to do. Those arguments are usable within the function to dispatch actions to redux to change state after whatever "async side effect" (network request) resolves.

  The following is nerd-level and *not important*, but in functional programming, a thunk is just a function that returns a function.
  You'd do that maybe if you know _some_ of what you need to know for the args now but wanna run the full thing later.
  Like if you had a function `const choose_outfit = (shoes, pants, shirt, accessories) => { return shoes + pants + shirt + accessories; };`
  You might could turn that into `const choose_outfit_to_match_shoes = shoes => (pants, shirt, accessories) => { return shoes + pants + shirt + accessories; };` <-- this is a "thunk" function
  Then you could be like `const choose_outfit_for_friend = choose_outfit_to_match_shoes(better_shoes_than_friend_is_capable_of_themselves);`
  Then you can pass the function to friend for them to input their own `pants, shirt, accessories`.
  Because of javascript's concept of "closures" and "scope" (in-memory isolation over whatever data you put between a function's curlies), `choose_outft_for_friend` can access the `shoes` varaible even though friemd themselves has no knowledge of what shoes.
  
  These "thunk" functions are sometimes referred to as "curried" functions.
  This is because the practice of taking a function `(a, b, c, ...) => { ... }`
  and turning it into `(a) => (b) => (c, ...) => { ... }` or whatever is called "currying" a function. Just chopping n screwing the args up.

  Oh whattup Sam Tay, we can get functional too.
*/

export const set_email_input_value = (value) => ({
  type: EMAIL_INPUT_VALUE_CHANGE,
  payload: value,
});

export const set_password_input_value = (value) => ({
  type: PASSWORD_INPUT_VALUE_CHANGE,
  payload: value,
});

export const check_for_current_session = () => async (
  dispatch,
  getState,
  Parse
) => {
  Parse.User.enableUnsafeCurrentUser();

  if (Parse.User.current()) {
    const cached_user_data = Parse.User.current().toJSON();
    const query = new Parse.Query(Parse.User);

    try {
      const user_data = await query.get(cached_user_data.objectId);

      return Promise.resolve(
        dispatch({
          type: RESTORE_USER_SESSION,
          payload: user_data.toJSON(),
        })
      );
    } catch (e) {
      return Promise.resolve(dispatch(add_app_error(e.message)));
    }
  }

  return Promise.resolve();
};

export const register_user = () => async (dispatch, getState, Parse) => {
  const { email_input_value, password_input_value, user } = getState().user;

  dispatch({
    type: USER_REGISTRATION_REQUEST_START,
  });

  try {
    const new_user = new Parse.User();

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
  Parse
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

export const log_user_in = () => async (dispatch, getState, Parse) => {
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

export const log_user_out = () => async (dispatch, getState, Parse) => {
  const { user } = getState().user;

  dispatch({
    type: SIGNOUT_REQUEST_START,
  });

  try {
    await Parse.User.logOut();

    dispatch({
      type: SIGNOUT_REQUEST_END,
    });
  } catch (e) {
    dispatch({
      type: SIGNOUT_REQUEST_END,
      payload: user,
    });
    dispatch(add_app_error(e.message));
  }
};
