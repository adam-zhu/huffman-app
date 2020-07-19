import React from "react";
import { Route } from "react-router-dom";
import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import HomeContainer from "Components/Home/HomeContainer";
import ProjectsContainer from "Components/Projects/ProjectsContainer";
import NewProjectContainer from "Components/NewProject/NewProjectContainer";
import QuestionnaireContainer from "Components/Questionnaire/QuestionnaireContainer";
import ProjectContainer from "Components/Project/ProjectContainer";
import ConsultationContainer from "Components/Consultation/ConsultationContainer";
import PackagesContainer from "Components/Packages/PackagesContainer";

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
          path="/questionnaire/:project_objectId/"
          component={QuestionnaireContainer}
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
