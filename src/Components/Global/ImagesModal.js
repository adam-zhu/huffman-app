import React, { useState } from "react";
import {
  IonButton,
  IonText,
  IonThumbnail,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonActionSheet,
} from "@ionic/react";
import { camera, trash, close } from "ionicons/icons";
import Modal from "Components/Global/Modal";

const ImagesModal = ({
  photos,
  deletePhoto,
  takePhoto,
  getPhotoFromFilesystem,
  close_handler,
  mode,
}) => {
  const [photo_to_delete, set_photo_to_delete] = useState();
  const file_input_change_handler = (e) => {
    const target = e.nativeEvent.target;
    const { files } = target;
    const file = files[0];

    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        getPhotoFromFilesystem(reader.result, file.name);
      };
    }
  };

  return (
    <Modal
      className="photo-upload-modal"
      title="Upload images"
      close_handler={close_handler}
    >
      <IonGrid>
        {photos.length > 0 && (
          <>
            <h6>{mode === "messages" ? "Message" : "Project"} images</h6>
            <IonRow
              className={photo_to_delete ? "has-selection" : "no-selection"}
            >
              {photos.map((photo, index) => {
                const src = photo.base64 ?? photo.webPath;

                return (
                  <IonCol key={index + photo.filepath}>
                    <IonThumbnail className="thumb">
                      <IonImg
                        onClick={() => set_photo_to_delete(photo)}
                        src={src}
                        className={
                          photo.filepath === photo_to_delete?.filepath
                            ? "selected-for-deletion"
                            : "not-selected"
                        }
                      />
                    </IonThumbnail>
                  </IonCol>
                );
              })}
            </IonRow>
          </>
        )}
        <IonRow>
          <h6>Add project images</h6>
        </IonRow>
        <IonRow className="trigger-buttons">
          <IonCol size="12">
            <IonButton
              expand="block"
              fill="outline"
              color="dark"
              onClick={takePhoto}
            >
              <IonIcon icon={camera} slot="start"></IonIcon> Take Photo
            </IonButton>
          </IonCol>
        </IonRow>
        <IonRow className="trigger-buttons">
          <IonCol size="12">
            <IonText>or</IonText>
          </IonCol>
        </IonRow>
        <IonRow className="trigger-buttons">
          <IonCol size="12">
            <input
              type="file"
              accept="image/*"
              onChange={file_input_change_handler}
            />
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonActionSheet
        isOpen={!!photo_to_delete}
        buttons={[
          {
            text: "Delete",
            role: "destructive",
            icon: trash,
            handler: () => {
              if (photo_to_delete) {
                deletePhoto(photo_to_delete);
                set_photo_to_delete(undefined);
              }
            },
          },
          {
            text: "Cancel",
            icon: close,
            role: "cancel",
          },
        ]}
        onDidDismiss={() => set_photo_to_delete(undefined)}
      />
      <IonButton onClick={close_handler}>Done</IonButton>
    </Modal>
  );
};

export default ImagesModal;
