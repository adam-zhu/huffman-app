import {
  EMAIL_INPUT_VALUE_CHANGE,
  PASSWORD_INPUT_VALUE_CHANGE,
  USER_REGISTRATION_REQUEST_START,
  USER_REGISTRATION_REQUEST_SUCCESS,
  USER_REGISTRATION_REQUEST_ERROR,
  USER_REGISTRATION_ERROR_DISMISSED,
} from "./reducer";
import { mockService } from "../utils";

/*
  You can only talk to Redux using its special walkie-talkie `dispatch`.
  `dispatch` normally only accepts `actions`.
  `actions` are just regular ass js objects:
      {
        type: "a type here so the reducer knows what kinda message it is",
        payload: some_data_or_maybe_not_whatever_u_wanna_do_so_ur_reducer_can_fuk_wit_it
      }
  
  There isn't room in that pattern to do something "async" (really just means in parallel).
  So there is a package added called `redux-thunk` which is to allow "side effects".
  Side effects is really just a term that means some code running somewhere else whose result is gonna affect your program. It's used interchangably with async a lot. Devs dunno what they're talking about most of the time and just parrot words they hear.

  The only important-ish thing to know is that regular "thinks" (referred to as "action creators" by the community) are just functions that take a piece of data, construct a POJO action object, and return that object.
  It doesn't have to take data if it doesn't need to, like if the think is "buttonClicked" or something. But if it's like "optionSelected", then you prob need data that indicates which option was selected.
  That's why when you `dispatch` a think from within a React component file, you run the think function first `dispatch(think(data))`.

  The reason why I like calling it a "think" is because its job is to:
    - take data from the user (user's input into the UI)
    - deduce some stuff based on it, like how to construct the action that's gonna get sent by the dispatch walkie-talkie ("think" about it)
    - dispatch the action to the redux store (which automatically uses those SPECIAL_ACTION_TYPE things to know which reducer to give it to so you don't have to worry about it at all)

  A "thunk" is basically like a future tense think. Rather than being a function that takes data and returns a POJO action, it returns another function.
  A `redux-thunk` thunk is a function that returns a function with a special set of arguments: (dispatch, getState, ParseAPI) => { ... }
  Since we have `redux-thunk` installed, `redux` knows that when `dispatch` gets a message that's not a POJO action but a function, then to run that function passing it (dispatch, getState, ParseAPI).
  If you just write the function signature like the example, then it will know what to do. Those arguments are usable within the function to dispatch actions to redux to change state after whatever "async side effect" (network request) resolves.

  The following is nerd-level and *not important*, but in functional programming, a thunk is just a function that returns a function.
  You'd do that maybe if you know some what what you need to know now but wanna run the full thing later.
  Like if you had a function `const chooseOutfit = (shoes, pants, shirt, accessories) => { return shoes + pants + shirt + accessories; };`
  You might could turn that into `const chooseOutfitToMatchShoes = shoes => (pants, shirt, accessories) => { return shoes + pants + shirt + accessories; };` <-- this is a "thunk" function
  Then you could be like `const chooseOutfitForAdam = chooseOutfitToMatchShoes(betterShoesThanAdamCanChooseForHimself);`
  Then you can pass the function to Adam for him to input his own `pants, shirt, accessories`.
  Because of javascript's concept of "closures" and "scope" (in-memory isolation over whatever data you put into a function's context), `chooseOutfitForAdam` can access the `shoes` varaible even though Adam himself has no knowledge of what shoes.
  
  These "thunk" functions are sometimes referred to as "curried" functions.
  This is because the practice of taking a function (a, b, c, ...) => { ... }
  and turning it into (a) => (b) => (c ...) => { ... } or whatever is called "currying" a function.

  Finna surprise Sam Tay w some new vocab soon.
*/

export const setEmailInputValue = (value) => ({
  type: EMAIL_INPUT_VALUE_CHANGE,
  payload: value,
});

export const setPasswordValue = (value) => ({
  type: PASSWORD_INPUT_VALUE_CHANGE,
  payload: value,
});

// this is just
// export const registerUser = () => async (dispatch, getState, ParseAPI) => {
//   const { emailInputValue, passwordInputValue } = getState().user;

//   dispatch({
//     type: HELLO_MESSAGE_CHANGE,
//     payload: inputValue,
//   });
// };

// export const dismissUserRegistrationError = () => ({
//   type: EMAIL_INPUT_VALUE_CHANGE,
//   payload: value,
// });
