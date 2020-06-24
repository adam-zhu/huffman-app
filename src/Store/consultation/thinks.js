import {
  CONSULTATION_GET_REQUEST_START,
  CONSULTATION_GET_REQUEST_END,
  MESSAGE_ENTERED,
  SEND_MESSAGE_REQUEST_START,
  SEND_MESSAGE_REQUEST_END,
  SUBSCRIBED,
  UNSUBSCRIBED,
  RECEIVE_MESSAGE,
} from "./reducer";
import { add_app_error } from "Store/errors/thinks";

// takes consultation data already loaded, requests messages, maps them onto the data, and puts it on the store
export const get_consultation = (consultation_data) => async (
  dispatch,
  getState,
  Parse
) => {
  const message_query = new Parse.Query("message");

  message_query.equalTo(
    "consultation",
    Parse.Object.extend("consultation").createWithoutData(
      consultation_data.objectId
    )
  );

  dispatch({
    type: CONSULTATION_GET_REQUEST_START,
  });

  try {
    const message_results = await message_query.find();

    dispatch({
      type: CONSULTATION_GET_REQUEST_END,
      payload: {
        ...consultation_data,
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
    type: SUBSCRIBED,
    payload: message_subscription,
  });

  message_subscription.on("create", (new_message) => {
    dispatch({
      type: RECEIVE_MESSAGE,
      payload: new_message.toJSON(),
    });
  });
};

export const stop_listening = () => (dispatch, getState) => {
  const { subscription } = getState().consultation;

  subscription.unsubscribe();

  dispatch({
    type: UNSUBSCRIBED,
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
