import {
  MESSAGE_ENTERED,
  SEND_MESSAGE_REQUEST_START,
  SEND_MESSAGE_REQUEST_END,
  CONSULTATION_CLOSE_REQUEST_START,
  CONSULTATION_CLOSE_REQUEST_END,
} from "./reducer";
import { add_app_error } from "Store/errors/thinks";

export const enter_message = (payload) => ({
  type: MESSAGE_ENTERED,
  payload,
});

export const send_message = ({
  project_objectId,
  consultation_objectId,
}) => async (dispatch, getState, Parse) => {
  const { projects, user } = getState();
  const project_data = projects.data.find(
    (p) => p.objectId === project_objectId
  );
  const consultation = project_data.consultations.find(
    (c) => c.objectId === consultation_objectId
  );
  const { amount_of_included_consultations } = project_data.package;
  const amount_of_messages_sent = (consultation.messages || []).filter(
    (m) => m.author.objectId === user.data.objectId
  ).length;
  const has_messages_remaining =
    amount_of_messages_sent < Number(amount_of_included_consultations);

  if (user.data.is_admin === true || has_messages_remaining) {
    const Message = Parse.Object.extend("message");
    const new_message = new Message();

    dispatch({
      type: SEND_MESSAGE_REQUEST_START,
    });

    new_message.set(
      "string_content",
      getState().consultation.message_input_value
    );
    new_message.set("author", Parse.User.current());
    new_message.set(
      "consultation",
      Parse.Object.extend("consultation").createWithoutData(
        consultation.objectId
      )
    );

    try {
      await new_message.save();

      dispatch({
        type: SEND_MESSAGE_REQUEST_END,
      });
    } catch (e) {
      dispatch({
        type: SEND_MESSAGE_REQUEST_END,
      });

      dispatch(add_app_error(e.message));
    }
  }
};

export const close_consultation = (consultation_objectId) => async (
  dispatch,
  getState,
  Parse
) => {
  const consultation_query = new Parse.Query("consultation");

  dispatch({
    type: CONSULTATION_CLOSE_REQUEST_START,
  });

  try {
    const consultation_object = await consultation_query.get(
      consultation_objectId
    );

    consultation_object.set("is_open", false);

    const updated_consultation_object = await consultation_object.save();

    dispatch({
      type: CONSULTATION_CLOSE_REQUEST_END,
      payload: {
        ...updated_consultation_object.toJSON(),
        messages: [],
      },
    });
  } catch (e) {
    dispatch({
      type: CONSULTATION_CLOSE_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};
