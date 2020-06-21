import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import HomeContainer from "Components/Home/HomeContainer";
import ProjectsContainer from "Components/Projects/ProjectsContainer";
import ProjectContainer from "Components/Project/ProjectContainer";
import { check_for_current_session } from "Store/user/thinks";

// pretty easy. make a PageContainerComponent per route.
// that container component just pulls in all of the smaller components the page needs
// the smaller components go into the Components/${NAME_OF_ROUTE} folder
// ones shared across multiple routes go into the Components/Shared folder
// ones that are global to the app (nav, error alerter, "app shell" or "app container" level stuff) go into Components/Global

const Routes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(check_for_current_session());
  }, []);

  return (
    <IonReactRouter cssClass="Routes">
      <IonRouterOutlet>
        <Route exact path="/" component={HomeContainer} />
        <Route exact path="/projects" component={ProjectsContainer} />
        <Route exact path="/projects/:objectId" component={ProjectContainer} />
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default Routes;
