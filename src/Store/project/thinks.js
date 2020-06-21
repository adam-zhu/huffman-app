import {
  PROJECT_GET_REQUEST_START,
  PROJECT_GET_REQUEST_END,
  MESSAGE_ENTERED,
  SEND_MESSAGE_REQUEST_START,
  SEND_MESSAGE_REQUEST_END,
  SUBSCRIBED,
  UNSUBSCRIBED,
  RECEIVE_MESSAGE,
} from "./reducer";
import { add_app_error } from "Store/errors/thinks";

export const get_project = (objectId) => async (dispatch, getState, Parse) => {
  const { user } = getState();
  const project_query = new Parse.Query("project");
  const message_query = new Parse.Query("message");

  if (!user.data.is_admin) {
    project_query.equalTo("created_by", Parse.User.current());
  }

  project_query.equalTo("objectId", objectId);
  project_query.include("package");
  message_query.equalTo(
    "project",
    Parse.Object.extend("project").createWithoutData(objectId)
  );

  dispatch({
    type: PROJECT_GET_REQUEST_START,
  });

  try {
    const project_results = await project_query.find();
    const message_results = await message_query.find();
    const project = project_results[0].toJSON();

    dispatch({
      type: PROJECT_GET_REQUEST_END,
      payload: {
        ...project,
        messages: message_results.map((r) => r.toJSON()),
      },
    });
  } catch (e) {
    dispatch({
      type: PROJECT_GET_REQUEST_END,
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
    "project",
    Parse.Object.extend("project").createWithoutData(objectId)
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

    console.log(document.getElementsByClassName("inner-scroll scroll-y"));

    window.requestAnimationFrame(() => {
      const content = document.querySelector("ion-content");

      content.scrollToBottom();
    });
  });
};

export const stop_listening = () => (dispatch, getState) => {
  const { subscription } = getState().project;

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
  const { project, user } = getState();
  const { amount_of_included_consultations } = project.data.package;
  const amount_of_messages_sent = project.data.messages.filter(
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

    new_message.set("string_content", project.message_input_value);
    new_message.set("author", Parse.User.current());
    new_message.set(
      "project",
      Parse.Object.extend("project").createWithoutData(project.data.objectId)
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
