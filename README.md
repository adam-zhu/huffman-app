# High level intro

This is an [`ionic`](https://ionicframework.com/docs) app with `react`. The `ionic` part is just the build harness, which means the code that bundles and builds the code you write into the code the browser runs. That's what stuff like `webpack` (most common _bundler_) does, and it uses things like `babel` (standard in all modern frontend apps) to _transpile_ our JS into stuff that runs on a bunch of diff browsers. All of the `ionic` code is located inside the `node_modules` folder, which is where stuff goes when you do `npm install react` and such. All of the code inside `src` is literally `create-react-app`.

Bundlers are what know how to automatically go in `node_modules` and smoothie up the code that your code needs along with your code by looking at your code. Fancy ones like `webpack` also come with dev servers that hot reload via watching your code for changes. That's what `create-react-app` uses to serve your code at localhost:3000 when you do `yarn start` or whatever (`yarn` and `npm` are both _package managers_ that do the `node_modules` and `package.json` stuff, `npm` is a little more popular but rn idk why bc the dev ux is the exact same). `package.json` also has scripts defined in it, which is what runs when you do `npm start` and is run by the `node.js` installation on your comp.

All the `ionic` is in `node_modules`, and if we just use the `react` components it provides us, then the _build_ step takes cares of the rest.

# redux

We have `redux` in here as a _global state store_ and/or _state management_ tool. There are many, `mobx` is a popular alternative. The `redux` pattern is simple and has three components:

- reducer
- `dispatch` (this is the official function exported by the lib so if misspell code barfs, other two are just official names for concepts)
- action

###### reducer

Think of this as a bucket or a folder. It's just a container for state data that you decide belongs together, like `user` or `posts` or `cart`. What it actually does in code is it exports a function that `(state, action) => { return updated_version_of_state_according_to_what_type_of_action }`. Because of that, it is also tradition to define your initial state in that file too `const initial_state = { data: "default" };`. Also, the reducer NEVER _mutates_ the state object (directly modify like `state.property = "new value"`) and always makes a new copy of it. This is bc in javascript, data that is `typeof data === "object"` is _passed by reference_, meaning it's just a pointer to a single location in memory so code anywhere that has a reference can alter the value. The concept of "_immutablility_" is common.
