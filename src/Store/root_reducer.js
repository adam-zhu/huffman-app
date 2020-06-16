import { combineReducers } from "redux";
import errors from "./errors/reducer";
import user from "./user/reducer";

export default combineReducers({
  errors,
  user,
});
