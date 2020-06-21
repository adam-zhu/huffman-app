import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "Styles/Messages.scss";
import {
  listen_for_messages,
  stop_listening,
  enter_message,
  send_message,
} from "Store/project/thinks";
import { IonButton, IonTextarea, IonCard } from "@ionic/react";

const Messages = ({ project }) => {
  const { data } = useSelector((state) => state.project);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listen_for_messages(project.objectId));

    return () => dispatch(stop_listening());
  }, [project.objectId]);

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
  const { user } = useSelector((state) => state);
  const is_author_current_user =
    message.author.objectId === user.data?.objectId;

  return (
    <div
      className={`message-row ${is_author_current_user ? "sent" : "received"}`}
    >
      <IonCard className="message-bubble">
        {message.string_content
          .split("\n")
          .map((text_content, index) =>
            text_content ? (
              <p key={index}>{text_content}</p>
            ) : (
              <br key={index} />
            )
          )}
      </IonCard>
    </div>
  );
};

const MessageInputForm = () => {
  const { project, user } = useSelector((state) => state);
  const { data, message_input_value, is_message_sending } = project;
  const { amount_of_included_consultations } = data.package;
  const amount_of_messages_sent = data.messages.filter(
    (m) => m.author.objectId === user.data?.objectId
  ).length;
  const message_limit_reached =
    !user.data?.is_admin &&
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
      {!user.data?.is_admin && (
        <strong>
          {amount_of_messages_sent} / {amount_of_included_consultations}
        </strong>
      )}
      <IonTextarea
        placeholder={
          message_limit_reached ? "limited reached" : "type a message..."
        }
        type="textarea"
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
