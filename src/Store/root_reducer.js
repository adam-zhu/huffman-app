import { combineReducers } from "redux";
import App from "./App/reducer";
import errors from "./errors/reducer";
import user from "./user/reducer";
import projects from "./projects/reducer";
import new_project from "./new_project/reducer";
import project from "./project/reducer";
import consultation from "./consultation/reducer";
import products from "./products/reducer";
import questionnaire from "./questionnaire/reducer";
import more_consultations from "./more_consultations/reducer";

export default combineReducers({
  App,
  errors,
  user,
  projects,
  new_project,
  project,
  consultation,
  products,
  questionnaire,
  more_consultations,
});
