import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { IonContent, IonPage, IonFooter } from "@ionic/react";
import ErrorAlerter from "Components/Global/ErrorAlerter";
import Header from "Components/Global/Header";
import "Styles/Global/PageContainer.scss";
import { ion_content_mounted, ion_content_unmounted } from "Store/App/thinks";

const PageContainer = ({ className, children, header, footer }) => {
  const { data } = useSelector((state) => state.user);
  const match = useRouteMatch();
  const history = useHistory();
  const is_user_logged_in = data !== undefined;
  const is_home_page = match.url === "/";
  const ion_content_ref = useRef(null);
  const dispatch = useDispatch();
  const user_not_logged_in_and_not_on_home_page =
    !is_user_logged_in && !is_home_page;

  useEffect(() => {
    if (user_not_logged_in_and_not_on_home_page) {
      history.replace("/");
    }

    dispatch(ion_content_mounted(ion_content_ref));

    return () => dispatch(ion_content_unmounted());
  }, [user_not_logged_in_and_not_on_home_page, ion_content_ref]);

  return (
    <IonPage id={className} className="ion-page">
      {typeof header === "function" ? header() : <Header />}
      <IonContent fullscreen ref={ion_content_ref}>
        <ErrorAlerter />
        <div id="page-container" className={className}>
          {children}
        </div>
      </IonContent>
      {footer && <IonFooter>{footer}</IonFooter>}
    </IonPage>
  );
};

export default PageContainer;
