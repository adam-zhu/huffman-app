import { combineReducers } from "redux";
import errors from "./errors/reducer";
import user from "./user/reducer";
import projects from "./projects/reducer";
import project from "./project/reducer";

export default combineReducers({
  errors,
  user,
  projects,
  project,
});
