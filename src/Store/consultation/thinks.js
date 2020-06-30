import {
  CONSULTATION_GET_REQUEST_START,
  CONSULTATION_GET_REQUEST_END,
  MESSAGE_ENTERED,
  SEND_MESSAGE_REQUEST_START,
  SEND_MESSAGE_REQUEST_END,
  MESSAGES_SUBSCRIBED,
  MESSAGES_UNSUBSCRIBED,
  RECEIVE_MESSAGE,
  CONSULTATION_CLOSE_REQUEST_START,
  CONSULTATION_CLOSE_REQUEST_END,
  CONSULTATION_SUBSCRIBED,
  CONSULTATION_UNSUBSCRIBED,
  CONSULATION_CLOSED,
} from "./reducer";
import { add_app_error } from "Store/errors/thinks";

// takes consultation data already loaded, requests messages, maps them onto the data, and puts it on the store
export const get_consultation = (objectId) => async (
  dispatch,
  getState,
  Parse
) => {
  const consultation_query = new Parse.Query("consultation");
  const message_query = new Parse.Query("message");

  consultation_query.include("project");
  message_query.equalTo(
    "consultation",
    Parse.Object.extend("consultation").createWithoutData(objectId)
  );

  dispatch({
    type: CONSULTATION_GET_REQUEST_START,
  });

  try {
    const consultation_result = await consultation_query.get(objectId);
    const message_results = await message_query.find();

    dispatch({
      type: CONSULTATION_GET_REQUEST_END,
      payload: {
        ...getState().consultation.data, // spread on whatever was put onto state from new_project
        ...consultation_result.toJSON(),
        messages: message_results.map((r) => r.toJSON()),
      },
    });
  } catch (e) {
    dispatch({
      type: CONSULTATION_GET_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

export const listen_for_consultation_close = (objectId) => async (
  dispatch,
  getState,
  Parse
) => {
  const consultation_query = new Parse.Query("consultation");

  consultation_query.equalTo(
    "consultation",
    Parse.Object.extend("consultation").createWithoutData(objectId)
  );

  const consultation_subscription = await consultation_query.subscribe();

  dispatch({
    type: CONSULTATION_SUBSCRIBED,
    payload: consultation_subscription,
  });

  consultation_subscription.on("update", (updated_consultation) => {
    dispatch({
      type: CONSULATION_CLOSED,
      payload: updated_consultation.toJSON(),
    });
  });
};

export const stop_listening_for_consultation_close = () => (
  dispatch,
  getState
) => {
  const { consultation_subscription } = getState().consultation;
  const unsubscribe = () =>
    consultation_subscription &&
    typeof consultation_subscription.unsubscribe === "function"
      ? consultation_subscription.unsubscribe()
      : () => {};

  unsubscribe();

  dispatch({
    type: CONSULTATION_UNSUBSCRIBED,
  });
};

export const listen_for_messages = (objectId) => async (
  dispatch,
  getState,
  Parse
) => {
  const message_query = new Parse.Query("message");

  message_query.equalTo(
    "consultation",
    Parse.Object.extend("consultation").createWithoutData(objectId)
  );

  const message_subscription = await message_query.subscribe();

  dispatch({
    type: MESSAGES_SUBSCRIBED,
    payload: message_subscription,
  });

  message_subscription.on("create", (new_message) => {
    dispatch({
      type: RECEIVE_MESSAGE,
      payload: new_message.toJSON(),
    });
  });
};

export const stop_listening_for_messages = () => (dispatch, getState) => {
  const { message_subscription } = getState().consultation;
  const unsubscribe = () =>
    message_subscription &&
    typeof message_subscription.unsubscribe === "function"
      ? message_subscription.unsubscribe()
      : () => {};

  unsubscribe();

  dispatch({
    type: MESSAGES_UNSUBSCRIBED,
  });
};

export const enter_message = (payload) => ({
  type: MESSAGE_ENTERED,
  payload,
});

export const send_message = () => async (dispatch, getState, Parse) => {
  const { consultation, user } = getState();
  const {
    amount_of_included_consultations,
  } = consultation.data.project.package;
  const amount_of_messages_sent = consultation.data.messages.filter(
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

    new_message.set("string_content", consultation.message_input_value);
    new_message.set("author", Parse.User.current());
    new_message.set(
      "consultation",
      Parse.Object.extend("consultation").createWithoutData(
        consultation.data.objectId
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

export const close_consultation = (consultation_data) => async (
  dispatch,
  getState,
  Parse
) => {
  const { data } = getState().consultation;
  const consultation_query = new Parse.Query("consultation");

  dispatch({
    type: CONSULTATION_CLOSE_REQUEST_START,
  });

  try {
    const consultation_object = await consultation_query.get(data.objectId);

    consultation_object.set("is_open", false);

    const updated_consultation_object = await consultation_object.save();

    dispatch({
      type: CONSULTATION_CLOSE_REQUEST_END,
      payload: {
        ...consultation_data,
        ...updated_consultation_object.toJSON(),
      },
    });
  } catch (e) {
    dispatch({
      type: CONSULTATION_CLOSE_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};
