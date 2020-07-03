import React, { useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import "Styles/Messages.scss";
import { enter_message, send_message } from "Store/consultation/thinks";
import { IonButton, IonTextarea, IonToast } from "@ionic/react";
import { scroll_ion_content_to_bottom } from "Utils";

const Messages = ({ messages }) => {
  useLayoutEffect(() => {
    window.requestAnimationFrame(scroll_ion_content_to_bottom);
  }, [(messages || []).length]);

  return (
    <div id="consultation-messages">
      <br />
      {Array.isArray(messages) ? (
        messages.length > 0 ? (
          messages.map((m) => <MessageRow key={m.objectId} message={m} />)
        ) : (
          <IonToast
            isOpen={true}
            header="New Consultation"
            message="This consultation doesn't have any messages yet. Type a message below
        and press send to begin."
            duration={4200}
            position="top"
            translucent
            buttons={[
              {
                text: "Dismiss",
                role: "cancel",
              },
            ]}
          />
        )
      ) : null}
      <MessageInputForm />
    </div>
  );
};

const MessageRow = ({ message }) => {
  const { user } = useSelector((state) => state);
  const is_author_current_user =
    message.author.objectId === user.data?.objectId;

  return (
    <div
      className={`message-row ${is_author_current_user ? "sent" : "received"}`}
    >
      <div className="message-bubble">
        {message.string_content
          .split("\n")
          .map((text_content, index) =>
            text_content ? (
              <p key={index}>{text_content}</p>
            ) : (
              <br key={index} />
            )
          )}
      </div>
    </div>
  );
};

const MessageInputForm = () => {
  const state = useSelector((state) => state);
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { message_input_value, is_message_sending } = state.consultation;
  const { project_objectId, consultation_objectId } = match.params;
  const message_input_handler = (e) => {
    dispatch(enter_message(e.detail.value));
  };
  const message_submit_handler = (e) => {
    e.preventDefault();

    dispatch(send_message({ project_objectId, consultation_objectId }));
  };

  return (
    <form onSubmit={message_submit_handler}>
      <IonTextarea
        placeholder="type a message..."
        type="textarea"
        value={message_input_value}
        onIonChange={message_input_handler}
        disabled={is_message_sending}
        required
        autofocus
      />
      <IonButton expand="block" type="submit" disabled={is_message_sending}>
        Send
      </IonButton>
    </form>
  );
};

export default Messages;
