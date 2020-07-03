import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import Parse from "parse";
import thunkMiddleware from "redux-thunk";
// import logger from "redux-logger";
import root_reducer from "./root_reducer";

Parse.serverURL = "https://letsdecorate.back4app.io"; // This is your Server URL
Parse.initialize(
  "W4f2B4g4iM635LZKAdf4adf65ZWEZ2f9bMXR5x59", // This is your Application ID
  "qsQ7Bmfey7mwsxdLURceDSg5gxrsXYFjaA6ibjGz" // This is your Javascript key
);

const store = createStore(
  root_reducer,
  {},
  composeWithDevTools(applyMiddleware(thunkMiddleware.withExtraArgument(Parse))) // this is where we pass in the back4app SDK (standard development kit) [built on top of https://parseplatform.org/]
);

export default store;
