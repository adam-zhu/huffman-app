import React from "react";
import { Provider } from "react-redux";
import { IonApp } from "@ionic/react";
import Store from "Store";
import Routes from "Components/Global/Routes"; // a "route" is just a url

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "Theme/variables.css";

/* Global styles */
import "./App.scss";

import { parse } from "Store";
let install = new parse.Installation();

const App = () => {
  install.save(null, {
    success: (install) => {
      // Execute any logic that should take place after the object is saved.
      console.log("New object created with objectId: " + install.id);
    },
    error: (install, error) => {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      console.error(error);
    },
  });

  return (
    <IonApp>
      <Provider store={Store}>
        <Routes />
      </Provider>
    </IonApp>
  );
};

export default App;
