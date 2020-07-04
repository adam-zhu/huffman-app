import React, { useEffect, useState } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { IonApp, IonProgressBar } from "@ionic/react";
import Store from "Store";
import Routes from "Components/Global/Routes"; // a "route" is just a url
import { check_for_current_session } from "Store/user/thinks";
import {
  get_data_and_listen_for_changes,
  stop_listening_for_changes,
} from "Store/projects/thinks";

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
// import "Styles/Theme/variables.css"; // this causes build to break for some reason

/* Global styles */
import "./App.scss";

const App = () => {
  return (
    <IonApp cssClass="app">
      <Provider store={Store}>
        <Pages />
      </Provider>
    </IonApp>
  );
};

const Pages = () => {
  const [is_session_restored, set_is_session_restored] = useState(false);
  const { user, projects } = useSelector((state) => state);
  const is_user_logged_in = user.data !== undefined;
  const { data_loading, data_loaded } = projects;
  const data_fetch_called = data_loading || data_loaded;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!is_session_restored) {
      dispatch(check_for_current_session()).then(() =>
        set_is_session_restored(true)
      );
    }

    if (is_session_restored && is_user_logged_in && !data_fetch_called) {
      dispatch(get_data_and_listen_for_changes());
    }

    return () => dispatch(stop_listening_for_changes());
  }, [is_session_restored, is_user_logged_in, data_fetch_called]);

  if (!is_session_restored || (is_user_logged_in && !projects.data)) {
    return <IonProgressBar type="indeterminate" />;
  }

  return <Routes />;
};

export default App;
