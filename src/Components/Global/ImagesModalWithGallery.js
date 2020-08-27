import React, { useState, useRef } from "react";
import {
  IonCard,
  IonContent,
  IonButton,
  IonText,
  IonThumbnail,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonActionSheet,
  IonToast,
} from "@ionic/react";
import { cameraOutline, imageOutline, trash, close } from "ionicons/icons";
import Modal from "Components/Global/Modal";
import "Styles/Global/ImagesModalWithGallery.scss";

const ImagesModalWithGallery = ({
  photos,
  deletePhoto,
  takePhoto,
  getPhotoFromFilesystem,
  close_handler,
}) => {
  const [photo_to_delete, set_photo_to_delete] = useState();
  const file_input_ref = useRef(null);
  const file_input_change_handler = (e) => {
    const target = e.nativeEvent.target;
    const { files } = target;

    Array.from(files).forEach((file) => {
      if (file) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
          getPhotoFromFilesystem(reader.result, file.name);
        };
      }
    });
  };

  return (
    <>
      <IonToast
        isOpen={true}
        header="Mobile device users"
        message={`If you experience any issues with the camera, use your device's native camera app and upload those photos instead.`}
        position="bottom"
        translucent
        buttons={[
          {
            text: "OK",
            role: "cancel",
          },
        ]}
      />
      <Modal
        className="images-modal-with-gallery"
        title="Upload images"
        close_handler={close_handler}
      >
        <IonContent>
          <IonGrid>
            <IonRow className="trigger-buttons">
              <IonCol size="12">
                <IonButton
                  expand="block"
                  fill="outline"
                  color="primary"
                  onClick={takePhoto}
                >
                  <IonIcon
                    icon={cameraOutline}
                    slot="start"
                    className="camera"
                  ></IonIcon>{" "}
                  Take Photo
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
                  hidden
                  ref={file_input_ref}
                  type="file"
                  accept="image/*"
                  onChange={file_input_change_handler}
                />
                <IonButton
                  expand="block"
                  fill="outline"
                  color="dark"
                  onClick={() => {
                    if (file_input_ref.current) {
                      file_input_ref.current.click();
                    }
                  }}
                >
                  <IonIcon icon={imageOutline} slot="start"></IonIcon> Upload
                  Photo
                </IonButton>
              </IonCol>
            </IonRow>
            {photos.length > 0 && (
              <>
                <br />
                <h6>Added photos</h6>
                <IonRow
                  className={`thumbnails ${
                    photo_to_delete ? "has-selection" : "no-selection"
                  }`}
                >
                  {photos
                    .slice()
                    .reverse()
                    .map((photo, index) => {
                      const src = photo.base64 ?? photo.webPath;

                      return (
                        <IonCol key={index + photo.filepath}>
                          <IonCard>
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
                          </IonCard>
                        </IonCol>
                      );
                    })}
                </IonRow>
              </>
            )}
          </IonGrid>
          <br />
          <IonButton onClick={close_handler} expand="block">
            Done
          </IonButton>
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
        </IonContent>
      </Modal>
    </>
  );
};

export default ImagesModalWithGallery;
