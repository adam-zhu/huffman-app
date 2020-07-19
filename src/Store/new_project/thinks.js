import {
  FORM_STATE_CHANGED,
  NEW_PROJECT_CREATE_REQUEST_START,
  NEW_PROJECT_CREATE_REQUEST_END,
} from "./reducer";
import { add_app_error } from "Store/errors/thinks";
import {
  get_data_and_listen_for_changes,
  stop_listening_for_changes,
} from "Store/projects/thinks";

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
  const NewProjectObject = new Project();

  NewProjectObject.set("name", new_project.name);
  NewProjectObject.set("description", new_project.description);
  NewProjectObject.set("room_width", new_project.room_width);
  NewProjectObject.set("room_length", new_project.room_length);
  NewProjectObject.set("room_height", new_project.room_height);
  NewProjectObject.set(
    "package",
    Parse.Object.extend("package").createWithoutData(
      new_project.package_objectId
    )
  );
  NewProjectObject.set("created_by", Parse.User.current());

  dispatch({
    type: NEW_PROJECT_CREATE_REQUEST_START,
  });

  try {
    const result = await NewProjectObject.save();
    const new_project_data = result.toJSON();

    dispatch(create_project_images({ history, new_project_data }));
  } catch (e) {
    dispatch({
      type: NEW_PROJECT_CREATE_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

const create_project_images = ({ history, new_project_data }) => async (
  dispatch,
  getState,
  Parse
) => {
  const { new_project } = getState();
  const ProjectImageObjects = new_project.project_images.map((p) => {
    const { base64, filepath } = p;
    const ProjectImage = Parse.Object.extend("project_image");
    const ProjectImageObject = new ProjectImage();

    ProjectImageObject.set(
      "project",
      Parse.Object.extend("project").createWithoutData(
        new_project_data.objectId
      )
    );
    ProjectImageObject.set("image", new Parse.File(filepath, { base64 }));

    return ProjectImageObject;
  });

  try {
    const result = await Promise.all(ProjectImageObjects.map((o) => o.save()));
    const project_images_data = result.map((r) => r.toJSON());

    dispatch({
      type: NEW_PROJECT_CREATE_REQUEST_END,
      payload: {
        ...new_project_data,
        project_images: project_images_data,
      },
    });

    await dispatch(stop_listening_for_changes());
    await dispatch(get_data_and_listen_for_changes());

    return Promise.resolve(
      history.push(`/questionnaire/${new_project_data.objectId}`)
    );
  } catch (e) {
    dispatch({
      type: NEW_PROJECT_CREATE_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
    dispatch(delete_project(new_project_data.objectId));
  }
};

const delete_project = (objectId) => async (dispatch, getState, Parse) => {
  const project_query = new Parse.Query("project");

  try {
    const project = await project_query.get(objectId);

    await project.destroy();
  } catch (e) {
    dispatch(add_app_error(e.message));
  }
};
