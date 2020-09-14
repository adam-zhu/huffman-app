import { createStore, applyMiddleware } from "redux";
import Parse from "parse";
import { loadStripe } from "@stripe/stripe-js";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import {
  PARSE_SERVER_URL,
  PARSE_APP_ID,
  PARSE_JS_ID,
  STRIPE_PUBLISHABLE_KEY,
} from "Constants";
import root_reducer from "./root_reducer";

Parse.serverURL = PARSE_SERVER_URL; // This is your Server URL
Parse.initialize(
  PARSE_APP_ID, // This is your Application ID
  PARSE_JS_ID // This is your Javascript key
);

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const StripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
const logger = createLogger({ collapsed: true });
const store = createStore(
  root_reducer,
  {},
  applyMiddleware(
    thunkMiddleware.withExtraArgument({ Parse, StripePromise }),
    logger
  )
);

export default store;
