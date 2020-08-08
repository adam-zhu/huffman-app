import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { IonHeader, IonToolbar, IonButtons, IonButton } from "@ionic/react";
import { log_user_out } from "Store/user/thinks";
import { select_project_data } from "Store/projects/selectors";

const Header = () => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const log_out_handler = () => dispatch(log_user_out(history));

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <BackButton />
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

const BackButton = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const state = useSelector((state) => state);
  const [text, href, routerDirection] = (() => {
    if (
      match.params.consultation_objectId !== undefined ||
      location.pathname.indexOf("questionnaire") !== -1
    ) {
      const project_data = select_project_data({ state, match });

      return [
        project_data?.name || "loading...",
        `/projects/${match.params.project_objectId}`,
        "back",
      ];
    }

    if (location.pathname === "/packages") {
      return ["New project", `/new`, "back"];
    }

    if (
      match.params.project_objectId !== undefined ||
      location.pathname === "/new"
    ) {
      return ["Projects", `/projects`, "back"];
    }

    return [];
  })();

  if (location.pathname === "/" || location.pathname === "/projects") {
    return null;
  }

  return (
    <IonButton routerLink={href} routerDirection={routerDirection}>
      &larr;&nbsp;{text}
    </IonButton>
  );
};

export default Header;
