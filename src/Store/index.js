import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import Parse from "parse";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./rootReducer";

Parse.serverURL = "https://parseapi.back4app.com"; // This is your Server URL
Parse.initialize(
  "W4f2B4g4iM635LZKAdf4adf65ZWEZ2f9bMXR5x59", // This is your Application ID
  "qsQ7Bmfey7mwsxdLURceDSg5gxrsXYFjaA6ibjGz" // This is your Javascript key
);

const store = createStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware(thunkMiddleware.withExtraArgument(Parse)))
);

export default store;
