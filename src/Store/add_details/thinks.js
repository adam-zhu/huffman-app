import {
  FORM_STATE_CHANGED,
  DETAILS_SAVE_REQUEST_START,
  DETAILS_SAVE_REQUEST_END,
  RESET_REDUCER_STATE,
} from "./reducer";
import { add_app_error } from "Store/errors/thinks";

export const set_form_field_value = (payload) => ({
  type: FORM_STATE_CHANGED,
  payload,
});

export const save_details = (project_objectId) => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  dispatch({ type: DETAILS_SAVE_REQUEST_START, payload: project_objectId });

  const errors = await Promise.all([
    dispatch(save_measurements(project_objectId)),
    dispatch(create_project_images(project_objectId)),
  ]);
  const nonNullErrors = errors.filter((e) => e !== null);

  dispatch({ type: DETAILS_SAVE_REQUEST_END, payload: project_objectId });

  nonNullErrors.forEach((e) => dispatch(add_app_error(e.message)));

  if (nonNullErrors.length === 0) {
    dispatch({ type: RESET_REDUCER_STATE });
  }
};

const save_measurements = (project_objectId) => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const { add_details } = getState();
  const project_query = new Parse.Query("project");

  try {
    const project = await project_query.get(project_objectId);

    project.set("room_width", add_details.room_width);
    project.set("room_length", add_details.room_length);
    project.set("room_height", add_details.room_height);

    await project.save();

    return null;
  } catch (e) {
    return e;
  }
};

const create_project_images = (project_objectId) => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const { add_details } = getState();
  const ProjectImageObjects = add_details.project_images.map((p) => {
    const { base64, filepath } = p;
    const ProjectImage = Parse.Object.extend("project_image");
    const ProjectImageObject = new ProjectImage();

    ProjectImageObject.set(
      "project",
      Parse.Object.extend("project").createWithoutData(project_objectId)
    );
    ProjectImageObject.set("image", new Parse.File(filepath, { base64 }));

    return ProjectImageObject;
  });

  try {
    await Promise.all(ProjectImageObjects.map((o) => o.save()));

    return null;
  } catch (e) {
    return e;
  }
};
