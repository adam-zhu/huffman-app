import React, { useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import ErrorAlerter from "Components/Global/ErrorAlerter";
import Header from "Components/Global/Header";
import "Styles/Global/PageContainer.scss";

// this is how we include global stuff -- we wrap every PageContainerComponent in this
const PageContainer = ({ className, children }) => {
  const { data } = useSelector((state) => state.user);
  const match = useRouteMatch();
  const history = useHistory();
  const is_user_logged_in = data !== undefined;
  const is_home_page = match.url === "/";

  useLayoutEffect(() => {
    if (!is_user_logged_in && !is_home_page) {
      history.replace("/");
    }
  }, [!is_user_logged_in && !is_home_page]);

  return (
    <IonPage id={className} className="ion-page">
      <Header />
      <IonContent fullscreen>
        <ErrorAlerter />
        <div id="page-container" className={className}>
          {children}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PageContainer;
