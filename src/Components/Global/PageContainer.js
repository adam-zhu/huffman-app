import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import ErrorAlerter from "Components/Global/ErrorAlerter";
import Header from "Components/Global/Header";
import "Styles/PageContainer.scss";

export const scroll_ion_content_to_bottom = async () => {
  const ion_content = document.querySelector("ion-content");
  const scroll_element = await ion_content.getScrollElement();

  // window.requestAnimationFrame(ion_content.scrollToBottom);
  window.requestAnimationFrame(() => {
    setTimeout(
      () => (scroll_element.scrollTop = scroll_element.scrollHeight),
      0
    );
  });
};

// this is how we include global stuff -- we wrap every PageContainerComponent in this
const PageContainer = ({ className, children }) => {
  const { data } = useSelector((state) => state.user);
  const match = useRouteMatch();
  const history = useHistory();
  const is_user_logged_in = data !== undefined;
  const is_home_page = match.url === "/";

  useEffect(() => {
    if (!is_user_logged_in && !is_home_page) {
      history.replace("/");
    }
  }, [!is_user_logged_in && !is_home_page]);

  return (
    <IonPage>
      <Header />
      <IonContent id="content" fullscreen>
        <div id="page-container" className={className}>
          {children}
        </div>
      </IonContent>
      <ErrorAlerter />
    </IonPage>
  );
};

export default PageContainer;
