import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { IonHeader, IonButton } from "@ionic/react";
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
      {user.data && <IonButton onClick={log_out_handler}>Log out</IonButton>}
    </IonHeader>
  );
};

export default Header;
