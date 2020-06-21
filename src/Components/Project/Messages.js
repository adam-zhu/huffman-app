import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "Styles/Messages.scss";
import {
  listen_for_messages,
  enter_message,
  send_message,
} from "Store/project/thinks";
import { IonButton, IonInput } from "@ionic/react";

const Messages = () => {
  const { project } = useSelector((root_state) => root_state);
  const { data } = project;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listen_for_messages());
  }, []);

  return (
    <div id="project-messages">
      {data.messages.map((m) => (
        <MessageRow key={m.objectId} message={m} />
      ))}
      <MessageInputForm />
    </div>
  );
};

const MessageRow = ({ message }) => {
  const { user } = useSelector((root_state) => root_state);
  const is_author_current_user = message.author.objectId === user.data.objectId;

  return (
    <div
      className={`message-row ${is_author_current_user ? "sent" : "received"}`}
    >
      <div className="message-bubble">{message.string_content}</div>
    </div>
  );
};

const MessageInputForm = () => {
  const { project, user } = useSelector((root_state) => root_state);
  const { data, message_input_value, is_message_sending } = project;
  const { amount_of_included_consultations } = data.package;
  const amount_of_messages_sent = data.messages.filter(
    (m) => m.author.objectId === user.data.objectId
  ).length;
  const message_limit_reached =
    amount_of_messages_sent >= Number(amount_of_included_consultations);
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
      <strong>
        {amount_of_messages_sent} / {amount_of_included_consultations}
      </strong>
      <IonInput
        placeholder={
          message_limit_reached ? "limited reached" : "type a message..."
        }
        type="text"
        value={message_input_value}
        onIonChange={message_input_handler}
        disabled={is_message_sending || message_limit_reached}
        required
      />
      <IonButton expand="block" type="submit" disabled={message_limit_reached}>
        Send
      </IonButton>
    </form>
  );
};

export default Messages;
