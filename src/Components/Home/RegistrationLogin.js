import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IonButton, IonInput } from "@ionic/react";
import "./RegistrationLogin.css";
import {
  set_email_input_value,
  set_password_input_value,
  register_user,
} from "Store/user/thinks";

const RegistrationLogin = () => {
  const {
    email_input_value,
    password_input_value,
    is_user_registration_request_busy,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const email_input_change_handler = (e) => {
    const trimmed = e.target.value.trim();

    dispatch(set_email_input_value(trimmed));
  };
  const password_input_change_handler = (e) => {
    const trimmed = e.target.value.trim();

    dispatch(set_password_input_value(trimmed));
  };
  const submit_handler = (e) => {
    e.preventDefault();

    dispatch(register_user());
  };

  return (
    <div className="registration-login-container">
      <form onSubmit={submit_handler}>
        <strong>Register an account</strong>
        <IonInput
          cssClass="field"
          placeholder="email"
          type="email"
          value={email_input_value}
          onIonChange={email_input_change_handler}
          disabled={is_user_registration_request_busy}
          required
        />
        <IonInput
          cssClass="field"
          placeholder="password"
          type="password"
          value={password_input_value}
          onIonChange={password_input_change_handler}
          disabled={is_user_registration_request_busy}
          required
        />
        <IonButton
          disabled={
            email_input_value.trim().length === 0 ||
            password_input_value.trim().length === 0 ||
            is_user_registration_request_busy
          }
          type="submit"
        >
          OK
        </IonButton>
      </form>
    </div>
  );
};

export default RegistrationLogin;
