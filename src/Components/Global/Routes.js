import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { IonRouterOutlet, IonProgressBar } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import HomeContainer from "Components/Home/HomeContainer";
import ProjectsContainer from "Components/Projects/ProjectsContainer";
import NewProjectContainer from "Components/NewProject/NewProjectContainer";
import ProjectContainer from "Components/Project/ProjectContainer";
import ConsultationContainer from "Components/Consultation/ConsultationContainer";
import PackagesContainer from "Components/Packages/PackagesContainer";
import { check_for_current_session } from "Store/user/thinks";

// pretty easy. make a PageContainerComponent per route.
// that container component just pulls in all of the smaller components the page needs
// the smaller components go into the Components/${NAME_OF_ROUTE} folder
// ones shared across multiple routes go into the Components/Shared folder
// ones that are global to the app (nav, error alerter, "app shell" or "app container" level stuff) go into Components/Global

const Routes = () => {
  const [is_session_restored, set_is_session_restored] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(check_for_current_session());

      set_is_session_restored(true);
    })();
  }, []);

  return is_session_restored ? (
    <IonReactRouter cssClass="Routes">
      <IonRouterOutlet>
        <Route exact={true} path="/" component={HomeContainer} />
        <Route exact={true} path="/projects" component={ProjectsContainer} />
        <Route
          exact={true}
          path="/new_project"
          component={NewProjectContainer}
        />
        <Route exact={true} path="/packages" component={PackagesContainer} />
        <Route
          exact={true}
          path="/project/:project_objectId"
          component={ProjectContainer}
        />
        <Route
          exact={true}
          path="/consultation/:consultation_objectId"
          component={ConsultationContainer}
        />
      </IonRouterOutlet>
    </IonReactRouter>
  ) : (
    <IonProgressBar type="indeterminate" />
  );
};

export default Routes;
