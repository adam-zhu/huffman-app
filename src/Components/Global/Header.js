import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { IonHeader, IonToolbar, IonButtons, IonButton } from "@ionic/react";
import { log_user_out } from "Store/user/thinks";

const Header = () => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;
  const redirect_to_home = () => history.push("/");
  const log_out_handler = async () => {
    await dispatch(log_user_out());

    return redirect_to_home();
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          {pathname !== "/" && pathname !== "/projects" && (
            <BackButton pathname={pathname} />
          )}
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

const BackButton = ({ pathname }) => {
  const root_state = useSelector((root_state) => root_state);
  const [text, href, routerDirection] = (() => {
    if (pathname.indexOf("/projects/") !== -1) {
      return ["Projects", "/projects", "back"];
    }

    if (pathname.indexOf("/consultation/") !== -1) {
      return [
        root_state.consultation.data
          ? `${root_state.consultation?.data?.project?.name}`
          : "loading...",
        `/projects/${root_state.consultation?.data?.project?.objectId}`,
        "back",
      ];
    }

    if (pathname.indexOf("/new_project") !== -1) {
      return ["Projects", "/projects", "back"];
    }
  })();

  return (
    <IonButton routerLink={href} routerDirection={routerDirection}>
      &larr;&nbsp;{text}
    </IonButton>
  );
};

export default Header;
