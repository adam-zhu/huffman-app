import {
  CONSULTATION_CREATE_REQUEST_START,
  CONSULTATION_CREATE_REQUEST_END,
} from "./reducer";
import { add_app_error } from "Store/errors/thinks";
import {
  get_data_and_listen_for_changes,
  stop_listening_for_changes,
} from "Store/projects/thinks";

export const begin_new_consultation = ({ history, project_objectId }) => async (
  dispatch,
  getState,
  Parse
) => {
  const Consultation = Parse.Object.extend("consultation");
  const NewConsultation = new Consultation();

  NewConsultation.set("is_open", true);
  NewConsultation.set(
    "project",
    Parse.Object.extend("project").createWithoutData(project_objectId)
  );
  NewConsultation.set("created_by", Parse.User.current());

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

    await dispatch(stop_listening_for_changes());
    await dispatch(get_data_and_listen_for_changes());

    return Promise.resolve(
      history.push(`/projects/${project_objectId}/${data.objectId}`)
    );
  } catch (e) {
    dispatch({
      type: CONSULTATION_CREATE_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};
