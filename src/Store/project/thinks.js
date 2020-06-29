import {
  PROJECT_GET_REQUEST_START,
  PROJECT_GET_REQUEST_END,
  CONSULTATION_CREATE_REQUEST_START,
  CONSULTATION_CREATE_REQUEST_END,
} from "./reducer";
import { NEW_CONSULTATION_START_SUCCESS } from "Store/consultation/reducer";
import { add_app_error } from "Store/errors/thinks";

export const get_project = (objectId) => async (dispatch, getState, Parse) => {
  const { user } = getState();
  const project_query = new Parse.Query("project");

  if (!user.data.is_admin) {
    project_query.equalTo("created_by", Parse.User.current());
  }

  project_query.include("package");

  dispatch({
    type: PROJECT_GET_REQUEST_START,
  });

  try {
    const project_result = await project_query.get(objectId);
    const project_data = project_result.toJSON();

    dispatch(get_consultations(project_data));
  } catch (e) {
    dispatch({
      type: PROJECT_GET_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

const get_consultations = (project_data) => async (
  dispatch,
  getState,
  Parse
) => {
  const consultation_query = new Parse.Query("consultation");

  consultation_query.equalTo(
    "project",
    Parse.Object.extend("project").createWithoutData(project_data.objectId)
  );

  try {
    const consultation_results = await consultation_query.find();

    dispatch({
      type: PROJECT_GET_REQUEST_END,
      payload: {
        ...project_data,
        consultations: consultation_results.map((r) => r.toJSON()),
      },
    });
  } catch (e) {
    dispatch({
      type: PROJECT_GET_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

export const begin_new_consultation = () => async (
  dispatch,
  getState,
  Parse
) => {
  const { project } = getState();

  const Consultation = Parse.Object.extend("consultation");
  const NewConsultation = new Consultation();

  NewConsultation.set(
    "project",
    Parse.Object.extend("project").createWithoutData(project.data.objectId)
  );
  NewConsultation.set("created_by", Parse.User.current());
  NewConsultation.set("is_open", true);

  dispatch({
    type: CONSULTATION_CREATE_REQUEST_START,
  });

  try {
    const result = await NewConsultation.save();
    const data = result.toJSON();

    dispatch({
      type: CONSULTATION_CREATE_REQUEST_END,
      payload: data,
    });

    dispatch({
      type: NEW_CONSULTATION_START_SUCCESS,
      payload: data,
    });

    dispatch(get_project(project.data.objectId)); // reload fresh data
  } catch (e) {
    dispatch({
      type: CONSULTATION_CREATE_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};
