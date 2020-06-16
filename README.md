# High level intro to frontend in general kinda ironyard refresh / ionic

This is an [`ionic`](https://ionicframework.com/docs) app with `react`. The `ionic` part is just the build harness, which means the code that bundles and builds the code you write into the code the browser runs.

> That's what stuff like `webpack` (most common _bundler_) does, and it uses things like `babel` (standard in all modern frontend apps) to _transpile_ our JS into stuff that runs on a bunch of diff browsers.

All of the `ionic` code is located inside the `node_modules` folder, which is where stuff goes when you do `npm install react` and such.

> All of the code inside `src` is literally out-of-the-box `create-react-app`.

Bundlers are what know how to automatically go in `node_modules` and smoothie up the code that your code needs (_dependencies_) along with your code by looking at your code. Fancy ones like `webpack` also come with dev servers that hot reload via watching your code for changes. That's what `create-react-app` uses to serve your code at `http://localhost:3000` when you do `yarn start` or whatever.

> `yarn` and `npm` are both _package managers_ that do the `node_modules` and `package.json` stuff, `npm` is a little more popular but idk why bc the dev ux is the exact same.

`package.json` also has scripts defined in it, which is what runs when you do `npm start` and is run by the `node.js` (javascript runtime) installation on your comp (`node` was conceived to run JS on servers).

> Browsers also have their own JS runtimes in them. This is how JS got to be what it is -- bc it got privileged by the standards committee to be the scripting language for the web.

All the `ionic` is in `node_modules`, and if we just use the `react` components it provides us, then the _build_ step takes cares of the rest.

# redux

We have `redux` in here as a _global state store_ and/or _state management_ tool. There are many, `mobx` is a popular alternative. The `redux` pattern is simple and has three components:

- reducer
- `dispatch` (this is the official function exported by the lib so if misspell code barfs, other two are just official names for concepts)
- action

### reducer

Think of this as a folder or a bucket. It's just a container for state data that you decide belongs together, like `user` or `posts` or `cart`.

> `redux` is just the frontend's db.

What it actually does in code is it exports a function that

```
(state, action) => { return updated_version_of_state_according_to_what_type_of_action }
```

Because of that, it is also tradition to define your initial state in that file too.

```
const initial_state = {
  data: "default",
  your: "mom",
  logged_in: true // because we trust u <3
};
```

> The reducer just defines a portion of a model (MVC). The data shape and how to change it.

The reducer NEVER _mutates_ the state object (directly modify like `state.property = "new value"`) and always makes a new copy of it:

```
const reducer = (state = initial_state, action) => { // this is one common way of writing reducers
  switch (action.type) {
    case ACTOIN_TYPE_WITH_NO_TYPO:
      return { // this creates a new inline object, _spreads_ the old state into it, and overwrites
        ...state,
        property_to_overwrite: action.payload
      };

    default: // bc best practice to always have default w switch
      return state;
  }
};
```

This is bc in javascript, data that is `typeof data === "object"` is _passed by reference_, meaning it's just a _pointer_ to a single location in memory so code anywhere that has a reference can alter the value (risky, hard bugs). The concept of "_immutablility_" is common.

> Modern device memory and js engine garbage collection enable speed "on the meat" to take precedence over on the metal.

Since the reducer needs to know the `action.type`, this is also traditionally where `ACTION_TYPES` are defined (caps lock is a general naming convention for important constants). We pass those around instead of plain strings bc the code won't run at all if we misspell the variable name so it's safer.

### actions

Literally just

```
const action = {
  type: A_TYPE_THAT_YOU_MADE_UP, // `redux` recommends modelling these as events, so like USER_LOGIN_SUCCESS rather than like SET_USER_LOGIN
  payload: whatever_data_u_want, // loose tradition is to use this payload prop to pass data
  whatever_u_want: u_can_have // but u can do whatever u want (i choose to just use payload)
};
```

This is the ONLY shit that `dispatch` will take (w vanilla `redux`). So ppl do a pattern of "action creators", or just

```
// action_creators.js
export const create_action = (data_from_the_DOM) => ({
  type: ACTION_TYPE_THAT_NEEDS_DATA,
  payload: data_from_the_DOM
});

// meanwhile in react_component.js
import { create_action } from 'actions_file';
import { useDispatch, useSelector } from 'react-redux';

// wrapped w `redux` <Provider> so can do the useSelector and useDispatch hooks (can explain how hooks work just ask)
const SearchInput = () => {
  const { search_input_value } = useSelector(root_state => root_state.chunk.maybe_subchunk_even);
  const dispatch = useDispatch();
  const search_input_change_handler = e => {
    const { value } = e.target;

    dispatch(create_action(value)); // executing `create_action` constructs & returns the action object
  };

  return <input type="text" value={search_input_value} onChange={search_input_change_handler} />
};
```

> If `dispatch` is the walkie-talkie, then actions are the preprogrammed message buttons on it.

What about when we need to make a network request? `redux-thunk`. Check comments in `src/Store/user/thinks.js` for explanation.
