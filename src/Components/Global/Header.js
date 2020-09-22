import React, { useEffect, useState } from "react";
import qs from "query-string";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { IonHeader, IonToolbar, IonButtons, IonButton } from "@ionic/react";
import { log_user_out } from "Store/user/thinks";
import { select_project_data } from "Store/projects/selectors";
import "Styles/Global/Header.scss";

const Header = () => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const log_out_handler = () => dispatch(log_user_out(history));

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          {location.pathname === "/" || location.pathname === "/projects" ? (
            <InstallButton />
          ) : (
            <BackButton />
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

const BackButton = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const state = useSelector((state) => state);
  const query_obj = qs.parse(location.search);
  const { package_objectId } = query_obj;
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
      return [
        "New project",
        package_objectId
          ? `/new?${qs.stringify({ ...query_obj, package_objectId })}`
          : `new`,
        "back",
      ];
    }

    if (location.pathname.indexOf("/more_consultations") === 0) {
      const project_data = select_project_data({ state, match });

      return [
        project_data?.name || "loading...",
        `/projects/${match.params.project_objectId}`,
        "back",
      ];
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

const InstallButton = () => {
  const [is_visible, set_is_visible] = useState(false);
  const click_handler = (e) => {
    set_is_visible(false);
    window.deferredPrompt.prompt();

    window.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome !== "accepted") {
        set_is_visible(true);
      }
    });
  };

  useEffect(() => {
    if (window.deferredPrompt) {
      set_is_visible(true);
    }
  }, []);

  if (!is_visible) {
    return null;
  }

  return (
    <IonButton id="install-button" onClick={click_handler}>
      Add to Home Screen
    </IonButton>
  );
};

export default Header;
