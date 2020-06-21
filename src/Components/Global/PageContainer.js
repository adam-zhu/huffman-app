import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import ErrorAlerter from "Components/Global/ErrorAlerter";
import Header from "Components/Global/Header";

// this is how we include global stuff -- we wrap every PageContainerComponent in this
const PageWrapper = ({ children }) => {
  return (
    <IonPage>
      <Header />
      <IonContent id="content">{children}</IonContent>
      <ErrorAlerter />
    </IonPage>
  );
};

export default PageWrapper;
