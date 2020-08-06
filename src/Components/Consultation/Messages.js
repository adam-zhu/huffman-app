import React, { useState, useLayoutEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import "Styles/Consultation/Messages.scss";
import {
  enter_message,
  change_message_images,
  send_message,
} from "Store/consultation/thinks";
import { IonButton, IonTextarea } from "@ionic/react";
import { useScrollIonContentToBottom, usePhotos } from "Hooks";
import ImagesModalWithGallery from "Components/Global/ImagesModalWithGallery";
import ThumbnailGallery from "Components/Global/ThumbnailGallery";
import {
  select_project_data,
  select_consultation_data,
} from "Store/projects/selectors";

const Messages = () => {
  const state = useSelector((state) => state);
  const match = useRouteMatch();
  const project_data = select_project_data({ state, match });
  const consultation_data = select_consultation_data({ state, match });
  const messages = Array.isArray(consultation_data.messages)
    ? consultation_data.messages.map((m) => ({
        ...m,
        project_images: project_data.project_images.filter(
          (i) => i.message?.objectId === m.objectId
        ),
      }))
    : [];

  useScrollIonContentToBottom({ after_every_render: true });

  if (
    !consultation_data ||
    !consultation_data?.is_open ||
    !consultation_data?.messages
  ) {
    return null;
  }

  return (
    <div id="consultation-messages">
      {messages.length > 0
        ? messages.map((m) => <MessageRow key={m.objectId} message={m} />)
        : "This consultation doesn't have any messages yet. Type a message below and press send to begin."}
      <MessageInputForm />
    </div>
  );
};

const MessageRow = ({ message }) => {
  const state = useSelector((state) => state);
  const { user } = state;
  const is_author_current_user =
    message.author.objectId === user.data?.objectId;

  return (
    <div
      className={`message-row ${is_author_current_user ? "sent" : "received"}`}
    >
      <div className="message-bubble">
        {message.string_content &&
          message.string_content
            .split("\n")
            .map((text_content, index) =>
              text_content ? (
                <p key={index}>{text_content}</p>
              ) : (
                <br key={index} />
              )
            )}
        {message.project_images?.length > 0 && (
          <ThumbnailGallery images={message.project_images} />
        )}
      </div>
    </div>
  );
};

const MessageInputForm = () => {
  const [is_images_modal_open, set_is_images_modal_open] = useState(false);
  const { deletePhoto, photos, takePhoto, getPhotoFromFilesystem } = usePhotos({
    selector: (state) => state.consultation.message_images,
    update_handler: (photos) => dispatch(change_message_images(photos)),
  });
  const state = useSelector((state) => state);
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const {
    message_input_value,
    is_message_sending,
    message_images,
  } = state.consultation;
  const { project_objectId, consultation_objectId } = match.params;
  const message_input_handler = (e) => {
    dispatch(enter_message(e.detail.value));
  };
  const message_submit_handler = async (e) => {
    e.preventDefault();

    await dispatch(
      send_message({
        project_objectId,
        consultation_objectId,
      })
    );
    photos.forEach(deletePhoto);
  };
  const textarea_input_ref = useRef(null);
  const to_thumbnail_gallery = (image) => ({
    ...image,
    image: {
      url: image.base64,
    },
  });

  useLayoutEffect(() => {
    if (textarea_input_ref.current) {
      textarea_input_ref.current.setFocus();
    }
  });

  return (
    <>
      <form onSubmit={message_submit_handler}>
        <IonTextarea
          placeholder="type a message..."
          inputmode="text"
          value={message_input_value}
          onIonChange={message_input_handler}
          disabled={is_message_sending}
          ref={textarea_input_ref}
          required={message_images.length === 0}
          auto-grow
          spellcheck
          autofocus
        />
        {message_images.length > 0 && (
          <ThumbnailGallery images={message_images.map(to_thumbnail_gallery)} />
        )}
        <IonButton
          expand="block"
          type="button"
          color="secondary"
          onClick={(e) => {
            e.preventDefault();
            set_is_images_modal_open(true);
          }}
          disabled={is_images_modal_open || is_message_sending}
        >
          {message_images.length > 0 ? "Add/Remove Images" : "Add Images"}
        </IonButton>
        <IonButton expand="block" type="submit" disabled={is_message_sending}>
          Send
        </IonButton>
      </form>
      {is_images_modal_open && (
        <ImagesModalWithGallery
          photos={photos}
          deletePhoto={deletePhoto}
          takePhoto={takePhoto}
          getPhotoFromFilesystem={getPhotoFromFilesystem}
          close_handler={(e) => set_is_images_modal_open(false)}
          mode="messages"
        />
      )}
    </>
  );
};

export default Messages;
