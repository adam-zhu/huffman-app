import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
} from "@ionic/react";
import { log_user_out } from "Store/user/thinks";

const Header = () => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const redirect_to_home = () => history.push("/");
  const log_out_handler = async () => {
    await dispatch(log_user_out());

    return redirect_to_home();
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/" />
        </IonButtons>
        <IonButtons slot="end">
          {user.data && (
            <IonButton onClick={log_out_handler}>Log out</IonButton>
          )}
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
