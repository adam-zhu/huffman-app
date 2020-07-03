import React from "react";
import { Route } from "react-router-dom";
import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import HomeContainer from "Components/Home/HomeContainer";
import ProjectsContainer from "Components/Projects/ProjectsContainer";
import NewProjectContainer from "Components/NewProject/NewProjectContainer";
import ProjectContainer from "Components/Project/ProjectContainer";
import ConsultationContainer from "Components/Consultation/ConsultationContainer";
import PackagesContainer from "Components/Packages/PackagesContainer";

// pretty easy. make a PageContainerComponent per route.
// that container component just pulls in all of the smaller components the page needs
// the smaller components go into the Components/${NAME_OF_ROUTE} folder
// ones shared across multiple routes go into the Components/Shared folder
// ones that are global to the app (nav, error alerter, "app shell" or "app container" level stuff) go into Components/Global

const Routes = () => {
  return (
    <IonReactRouter cssClass="Routes">
      <IonRouterOutlet>
        <Route exact={true} path="/" component={HomeContainer} />
        <Route exact={true} path="/projects" component={ProjectsContainer} />
        <Route
          exact={true}
          path="/projects/new"
          component={NewProjectContainer}
        />
        <Route exact={true} path="/packages" component={PackagesContainer} />
        <Route
          exact={true}
          path="/projects/:project_objectId"
          component={ProjectContainer}
        />
        <Route
          exact={true}
          path="/projects/:project_objectId/:consultation_objectId"
          component={ConsultationContainer}
        />
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default Routes;
