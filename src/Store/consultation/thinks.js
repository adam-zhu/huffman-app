import {
  MESSAGE_ENTERED,
  MESSAGE_IMAGES_CHANGED,
  SEND_MESSAGE_REQUEST_START,
  SEND_MESSAGE_REQUEST_END,
  CONSULTATION_CLOSE_REQUEST_START,
  CONSULTATION_CLOSE_REQUEST_END,
  MESSAGE_VIEWED_REQUEST_START,
  MESSAGE_VIEWED_REQUEST_END,
} from "./reducer";
import { add_app_error } from "Store/errors/thinks";
import Logger from "../../Services/Logger";

export const enter_message = (payload) => ({
  type: MESSAGE_ENTERED,
  payload,
});

export const change_message_images = (payload) => ({
  type: MESSAGE_IMAGES_CHANGED,
  payload,
});

export const message_viewed = (message) => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const { user } = getState();
  const query = new Parse.Query("message");

  dispatch({
    type: MESSAGE_VIEWED_REQUEST_START,
    payload: message.objectId,
  });

  try {
    const message_object = await query.get(message.objectId);

    message_object.set(
      user.data.is_admin ? "admin_viewed" : "user_viewed",
      true
    );

    const result = await message_object.save();

    dispatch({
      type: MESSAGE_VIEWED_REQUEST_END,
      payload: message.objectId,
    });
  } catch (e) {
    dispatch({
      type: MESSAGE_VIEWED_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

export const send_message = ({
  project_objectId,
  consultation_objectId,
}) => async (dispatch, getState, { Parse, StripePromise }) => {
  const { user, projects, consultation } = getState();
  const { message_input_value, message_images } = consultation;
  const project_data = projects.data.find(
    (p) => p.objectId === project_objectId
  );
  const consultation_data = project_data.consultations.find(
    (c) => c.objectId === consultation_objectId
  );
  const Message = Parse.Object.extend("message");
  const new_message = new Message();

  dispatch({
    type: SEND_MESSAGE_REQUEST_START,
  });

  new_message.set("string_content", message_input_value);
  new_message.set("author", Parse.User.current());
  new_message.set(
    "consultation",
    Parse.Object.extend("consultation").createWithoutData(
      consultation_data.objectId
    )
  );

  try {
    const new_message_data = await new_message.save();
    const current_user = Parse.User.current();

    if (message_images.length > 0) {
      await dispatch(
        create_and_attach_project_images({
          message_data: new_message_data.toJSON(),
          project_objectId,
        })
      );
    }

    // if admin send sms to client
    // else send sms to admin
    if (user.data.is_admin) {
      dispatch(
        send_notification({
          to: project_data.created_by.phone,
          message: `You have a new message on Let's Decorate from Lynda Huffman`,
        })
      );
    } else {
      dispatch(
        send_notification({
          to: "+13184028190",
          message: `You have a new message on Let's Decorate from ${current_user.get(
            "first_name"
          )} ${current_user.get("last_name")}`,
        })
      );
    }

    dispatch({
      type: SEND_MESSAGE_REQUEST_END,
    });
  } catch (e) {
    dispatch({
      type: SEND_MESSAGE_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

const send_notification = ({ to, message }, attempt = 1) => async (
  dispatch,
  getState,
  { Parse }
) => {
  if (to) {
    const message_data = {
      to: to,
      from: "+12512765994",
      body: message,
    };

    dispatch({ type: "consultation/NOTIFICATION_SEND", payload: message_data });

    Logger.log(`Attempting to send sms message (attempt ${attempt})`, {
      recipient: to,
    });

    const notification_result = await Parse.Cloud.run(
      "send_sms_notification",
      message_data
    );

    Logger.log(`SMS notification result (attempt ${attempt})`, {
      result: notification_result,
    });

    console.log("notification result!");
    console.log(notification_result);

    if (notification_result.success !== true && attempt < 5) {
      await dispatch(send_notification({ to, message }, attempt + 1));
    } else {
      Logger.log(`Successfully sent sms message (attempt ${attempt})`, {
        recipient: to,
      });
    }

    dispatch({
      type: "consultation/NOTIFICATION_RESULT",
      payload: notification_result,
    });

    if (notification_result?.error_message && attempt >= 5) {
      Logger.log(`Error sending sms message (attempt ${attempt})`, {
        error: notification_result.error_message,
      });
      dispatch(add_app_error(notification_result.error_message));
    }
  }
};

const create_and_attach_project_images = ({
  message_data,
  project_objectId,
}) => async (dispatch, getState, { Parse, StripePromise }) => {
  const state = getState();
  const { consultation } = state;
  const ProjectImageObjects = consultation.message_images.map((p) => {
    const { base64, filepath } = p;
    const ProjectImage = Parse.Object.extend("project_image");
    const ProjectImageObject = new ProjectImage();

    ProjectImageObject.set(
      "project",
      Parse.Object.extend("project").createWithoutData(project_objectId)
    );
    ProjectImageObject.set("image", new Parse.File(filepath, { base64 }));
    ProjectImageObject.set(
      "message",
      Parse.Object.extend("message").createWithoutData(message_data.objectId)
    );

    return ProjectImageObject;
  });

  try {
    await Promise.all(ProjectImageObjects.map((o) => o.save()));

    dispatch({
      type: SEND_MESSAGE_REQUEST_END,
    });
  } catch (e) {
    dispatch({
      type: SEND_MESSAGE_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

export const close_consultation = (consultation_objectId) => async (
  dispatch,
  getState,
  { Parse, StripePromise }
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
      payload: updated_consultation_object.toJSON(),
    });
  } catch (e) {
    dispatch({
      type: CONSULTATION_CLOSE_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};
