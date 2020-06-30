import {
  PROJECTS_GET_REQUEST_START,
  PROJECTS_GET_REQUEST_END,
} from "./reducer";
import { add_app_error } from "Store/errors/thinks";

export const get_projects = () => async (dispatch, getState, Parse) => {
  const { user } = getState();
  const query = new Parse.Query("project");

  if (!user.data.is_admin) {
    query.equalTo("created_by", Parse.User.current());
  }

  query.include("package");
  query.include("created_by");
  query.descending("createdAt");

  dispatch({
    type: PROJECTS_GET_REQUEST_START,
  });

  try {
    const results = await query.find();
    const formatted = results.map((r) => r.toJSON());

    dispatch({
      type: PROJECTS_GET_REQUEST_END,
      payload: formatted,
    });
  } catch (e) {
    dispatch({
      type: PROJECTS_GET_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};
