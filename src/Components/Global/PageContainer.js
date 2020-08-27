import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useHistory,
  useRouteMatch,
  useLocation,
  Redirect,
} from "react-router-dom";
import { IonContent, IonPage, IonFooter } from "@ionic/react";
import ErrorAlerter from "Components/Global/ErrorAlerter";
import Header from "Components/Global/Header";
import "Styles/Global/PageContainer.scss";
import { ion_content_mounted, ion_content_unmounted } from "Store/App/thinks";

const PageContainer = ({
  id,
  className,
  ionContentClassName,
  pageContainerClassName,
  children,
  header,
  footer,
}) => {
  const { data } = useSelector((state) => state.user);
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const is_user_logged_in = data !== undefined;
  const is_home_page = match.url === "/";
  const ion_content_ref = useRef(null);
  const dispatch = useDispatch();
  const user_not_logged_in_and_not_on_home_page =
    !is_user_logged_in && !is_home_page;
  const header_element =
    typeof header === "function" ? (
      header()
    ) : header === false ? null : (
      <Header />
    );

  useEffect(() => {
    if (user_not_logged_in_and_not_on_home_page) {
      history.replace("/");
    }
  }, [user_not_logged_in_and_not_on_home_page]);

  useLayoutEffect(() => {
    dispatch(ion_content_mounted(ion_content_ref));

    return () => dispatch(ion_content_unmounted());
  }, [ion_content_ref, match, location]);

  if (user_not_logged_in_and_not_on_home_page) {
    return <Redirect to="/" />;
  }

  return (
    <IonPage id={id} className={`ion-page ${className || ""}`}>
      {header_element}
      <IonContent
        fullscreen
        ref={ion_content_ref}
        className={ionContentClassName}
      >
        <ErrorAlerter />
        <div id="page-container" className={pageContainerClassName}>
          {children}
        </div>
      </IonContent>
      {footer && <IonFooter>{footer}</IonFooter>}
    </IonPage>
  );
};

export default PageContainer;
