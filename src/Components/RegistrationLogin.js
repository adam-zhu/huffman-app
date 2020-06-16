import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IonButton, IonInput } from "@ionic/react";
import "./RegistrationLogin.css";
import {
  setEmailInputValue,
  setPasswordInputValue,
  registerUser,
  dismissUserRegistrationError,
} from "Store/user/thinks";

const RegistrationLogin = () => {
  const {
    emailInputValue,
    passwordInputValue,
    isUserRegistrationRequestBusy,
    userRegistrationError,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const emailInputChangeHandler = (e) => {
    const trimmedValue = e.target.value.trim();

    dispatch(setEmailInputValue(trimmedValue));
  };
  const passwordInputChangeHandler = (e) => {
    const trimmedValue = e.target.value.trim();

    dispatch(setPasswordInputValue(trimmedValue));
  };
  const registerButtonClickHandler = () => {
    dispatch(registerUser());
  };
  const dismissErrorButtonClickHandler = () => {
    dispatch(dismissUserRegistrationError());
  };

  return (
    <div className="container">
      <strong>Sign up</strong>
      {isUserRegistrationRequestBusy ? (
        "loading"
      ) : (
        <p>
          <IonInput
            placeholder="email"
            type="text"
            value={emailInputValue}
            onIonChange={emailInputChangeHandler}
          />
          <IonInput
            placeholder="password"
            type="password"
            value={passwordInputValue}
            onIonChange={passwordInputChangeHandler}
          />
          <IonButton
            disabled={
              emailInputValue.trim().length === 0 ||
              passwordInputValue.trim().length === 0
            }
            onIonClick={registerButtonClickHandler}
          >
            Register
          </IonButton>
        </p>
      )}
      {userRegistrationError && (
        <p>
          Error: {userRegistrationError}
          <IonButton onIonClick={dismissErrorButtonClickHandler}>OK</IonButton>
        </p>
      )}
    </div>
  );
};

export default RegistrationLogin;
