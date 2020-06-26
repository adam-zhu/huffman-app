import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "Styles/Messages.scss";
import {
  listen_for_messages,
  stop_listening,
  enter_message,
  send_message,
  close_consultation,
} from "Store/consultation/thinks";
import { IonButton, IonTextarea, IonAlert } from "@ionic/react";
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
      <br />
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
  const [
    is_confrim_close_consultation_modal_open,
    set_confirm_close_consultation_modal_open,
  ] = useState(false);
  const { consultation, user } = useSelector((state) => state);
  const { message_input_value, is_message_sending } = consultation;
  const dispatch = useDispatch();
  const message_input_handler = (e) => {
    dispatch(enter_message(e.target.value));
  };
  const message_submit_handler = (e) => {
    e.preventDefault();

    dispatch(send_message());
  };
  const close_consultation_handler = (e) => {
    e.preventDefault();

    dispatch(close_consultation());
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
      {user.data.is_admin === true && (
        <IonButton
          expand="block"
          type="button"
          color="danger"
          onClick={(e) => set_confirm_close_consultation_modal_open(true)}
        >
          Close Consultation
        </IonButton>
      )}
      <IonAlert
        isOpen={is_confrim_close_consultation_modal_open}
        message="Are you sure you want to close this consultation?"
        cssClass="confirm-consultation-close-modal"
        header="Close Consultation"
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: (e) => set_confirm_close_consultation_modal_open(false),
          },
          {
            text: "Close Consultation",
            cssClass: "primary",
            handler: close_consultation_handler,
          },
        ]}
      />
    </form>
  );
};

export default Messages;
