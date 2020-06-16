import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import ErrorAlerter from "Components/Global/ErrorAlerter";

// this is how we include global stuff -- we wrap every PageContainerComponent in this
const PageWrapper = ({ children }) => {
  return (
    <IonPage>
      <IonContent>
        <ErrorAlerter /> {/*👀 global stuff*/}
        {children}
      </IonContent>
    </IonPage>
  );
};

export default PageWrapper;
