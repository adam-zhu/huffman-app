import React from "react";
import { Route } from "react-router-dom";
import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import HomeContainer from "PageContainerComponents/Home";

// pretty easy. make a PageContainerComponent per route.
// that container component just pulls in all of the smaller components the page needs
// the smaller components go into the Components/${NAME_OF_ROUTE} folder
// ones shared across multiple routes go into the Components/Shared folder
// ones that are global to the app (nav, error alerter, "app shell" or "app container" level stuff) go into Components/Global

const Routes = () => {
  return (
    <IonReactRouter cssClass="Routes">
      <IonRouterOutlet>
        <Route exact path="/" component={HomeContainer} />
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default Routes;
