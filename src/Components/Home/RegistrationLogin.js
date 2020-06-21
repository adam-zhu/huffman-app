import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IonButton, IonInput } from "@ionic/react";
import { Redirect } from "react-router-dom";
import "Styles/RegistrationLogin.scss";
import {
  set_email_input_value,
  set_password_input_value,
  register_user,
  log_user_in,
  check_email_verification,
} from "Store/user/thinks";

const RegistrationLogin = () => {
  const { data } = useSelector((state) => state.user);

  if (data === undefined) {
    return <Form />;
  }

  if (!data.emailVerified) {
    return <PleaseVerifyYourEmail />;
  }

  return <Redirect to="/projects" />;
};

const Form = () => {
  const [mode, set_mode] = useState("registration");
  const toggle_mode = () =>
    set_mode(mode === "registration" ? "login" : "registration");
  const {
    email_input_value,
    password_input_value,
    is_registration_request_busy,
    is_signin_request_busy,
  } = useSelector((state) => state.user);
  const is_form_busy =
    mode === "registration"
      ? is_registration_request_busy
      : is_signin_request_busy;
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

    dispatch(mode === "registration" ? register_user() : log_user_in());
  };
  const password_regex = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$";

  return (
    <form className="registration-login" onSubmit={submit_handler}>
      {mode === "registration" ? (
        <>
          <strong>Create an account or </strong>
          <IonButton
            size="small"
            color="secondary"
            fill="outline"
            expand="block"
            onClick={toggle_mode}
          >
            log in to an existing account{" "}
            <i className="material-icons md-18">chevron_right</i>
          </IonButton>
        </>
      ) : (
        <>
          <IonButton
            size="small"
            color="secondary"
            fill="outline"
            expand="block"
            onClick={toggle_mode}
          >
            <i className="material-icons md-18">chevron_left</i> create a new
            account
          </IonButton>
        </>
      )}
      <IonInput
        cssClass="field"
        placeholder="email"
        type="email"
        value={email_input_value}
        onIonChange={email_input_change_handler}
        disabled={is_form_busy}
        required
      />
      <IonInput
        cssClass="field"
        placeholder="password"
        type="password"
        pattern={password_regex}
        value={password_input_value}
        onIonChange={password_input_change_handler}
        disabled={is_form_busy}
        required
      />
      <IonButton
        expand="block"
        disabled={
          email_input_value.trim().length === 0 ||
          new RegExp(password_regex).test(password_input_value) === false ||
          is_form_busy
        }
        type="submit"
      >
        {mode === "registration" ? "Register" : "Log In"}
      </IonButton>
    </form>
  );
};

const PleaseVerifyYourEmail = () => {
  const { data } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const check_email_verification_handler = (e) =>
    dispatch(check_email_verification());

  return (
    <p>
      A verification email has been sent to {data.email}. Please verify your
      email address and check back to proceed.
      <IonButton onClick={check_email_verification_handler}>
        Email Verified
      </IonButton>
    </p>
  );
};

export default RegistrationLogin;
