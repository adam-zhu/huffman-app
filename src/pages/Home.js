import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import RegistrationLogin from "Components/RegistrationLogin";
import "./Home.css";
import { setHelloMessage, setInputValue } from "Store/user/thinks";

const Home = () => {
  const { inputValue, helloMessage, firstName, lastName } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const inputChangeHandler = (e) => {
    const trimmedValue = e.target.value.trim();

    dispatch(setInputValue(trimmedValue));
  };
  const changeHelloMessageClickHandler = () => {
    dispatch(setHelloMessage());
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RegistrationLogin />
      </IonContent>
    </IonPage>
  );
};

export default Home;
