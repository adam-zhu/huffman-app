import {
  FORM_STATE_CHANGED,
  NEW_PROJECT_CREATE_REQUEST_START,
  NEW_PROJECT_CREATE_REQUEST_END,
} from "./reducer";
import { LIVE_QUERIES_DATA_UPDATED } from "Store/projects/reducer";
import { add_app_error } from "Store/errors/thinks";

export const set_form_field_value = (payload) => ({
  type: FORM_STATE_CHANGED,
  payload,
});

export const create_new_project = (history) => async (
  dispatch,
  getState,
  Parse
) => {
  const { new_project } = getState();

  const Project = Parse.Object.extend("project");
  const NewProject = new Project();

  NewProject.set("name", new_project.name);
  NewProject.set("description", new_project.description);
  NewProject.set("room_width", new_project.room_width);
  NewProject.set("room_length", new_project.room_length);
  NewProject.set("room_height", new_project.room_height);
  NewProject.set(
    "package",
    Parse.Object.extend("package").createWithoutData(
      new_project.package_objectId
    )
  );
  NewProject.set("created_by", Parse.User.current());

  dispatch({
    type: NEW_PROJECT_CREATE_REQUEST_START,
  });

  try {
    const result = await NewProject.save();
    const data = result.toJSON();

    dispatch({
      type: NEW_PROJECT_CREATE_REQUEST_END,
      payload: data,
    });

    history.push(`/projects/${data.objectId}`);
  } catch (e) {
    dispatch({
      type: NEW_PROJECT_CREATE_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};
