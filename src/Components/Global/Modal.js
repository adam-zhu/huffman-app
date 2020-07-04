import React from "react";
import {
  IonModal,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/react";
import "Styles/Global/Modal.scss";

const Modal = ({ className, title, close_handler, children }) => {
  return (
    <IonModal
      isOpen={true}
      swipeToClose={true}
      onDidDismiss={close_handler}
      cssClass={`generic-modal ${className}`}
    >
      <IonToolbar>
        {title && <IonTitle>{title}</IonTitle>}
        <IonButtons slot="end">
          <IonButton onClick={close_handler}>
            <IonIcon icon="close" color="dark" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      {children}
    </IonModal>
  );
};

export default Modal;
