import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "Styles/Messages.scss";
import {
  listen_for_messages,
  stop_listening,
  enter_message,
  send_message,
} from "Store/consultation/thinks";
import { IonButton, IonTextarea } from "@ionic/react";
import { scroll_ion_content_to_bottom } from "Components/Global/PageContainer";

const Messages = ({ consultation }) => {
  const { data } = useSelector((state) => state.consultation);
  const dispatch = useDispatch();
  const messages = data.messages || [];

  useEffect(() => {
    dispatch(listen_for_messages(consultation.objectId));
    scroll_ion_content_to_bottom();

    return () => dispatch(stop_listening());
  }, [consultation.objectId]);

  useEffect(() => {
    window.requestAnimationFrame(scroll_ion_content_to_bottom);
  }, [messages.length]);

  return (
    <div id="consultation-messages">
      <div>
        {messages.map((m) => (
          <MessageRow key={m.objectId} message={m} />
        ))}
      </div>
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
  const { consultation, user } = useSelector((state) => state);
  const { data, message_input_value, is_message_sending } = consultation;
  const dispatch = useDispatch();
  const message_input_handler = (e) => {
    dispatch(enter_message(e.target.value));
  };
  const message_submit_handler = (e) => {
    e.preventDefault();

    dispatch(send_message());
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
      />
      <IonButton expand="block" type="submit" disabled={is_message_sending}>
        Send
      </IonButton>
    </form>
  );
};

export default Messages;
