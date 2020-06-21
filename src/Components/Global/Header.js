import React from "react";
import { useDispatch } from "react-redux";
import {
  IonMenuButton,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonButton,
} from "@ionic/react";
import { log_user_out } from "Store/user/thinks";

const Header = () => {
  const dispatch = useDispatch();

  return (
    <>
      <IonHeader>
        <IonMenuButton />
      </IonHeader>
      <IonMenu side="start" contentId="content">
        <IonToolbar color="primary">
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
        <IonList>
          <IonItem>
            <IonButton onClick={() => dispatch(log_user_out())}>
              Log out
            </IonButton>
          </IonItem>
        </IonList>
      </IonMenu>
    </>
  );
};

export default Header;
