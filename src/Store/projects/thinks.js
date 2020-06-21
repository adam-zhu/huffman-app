import {
  PROJECTS_GET_REQUEST_START,
  PROJECTS_GET_REQUEST_END,
} from "./reducer";
import { add_app_error } from "Store/errors/thinks";

export const get_projects = () => async (dispatch, getState, Parse) => {
  const query = new Parse.Query("project");

  query.equalTo("created_by", Parse.User.current());
  query.include("package");

  dispatch({
    type: PROJECTS_GET_REQUEST_START,
  });

  try {
    const results = await query.find();

    dispatch({
      type: PROJECTS_GET_REQUEST_END,
      payload: results.map((r) => r.toJSON()),
    });
  } catch (e) {
    dispatch({
      type: PROJECTS_GET_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};
