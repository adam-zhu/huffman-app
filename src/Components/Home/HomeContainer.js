import React, { useLayoutEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  IonButton,
  IonInput,
  IonImg,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
  IonToast,
} from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import PageContainer from "Components/Global/PageContainer";
import "Styles/Home/HomeContainer.scss";
import {
  set_input_value,
  register_user,
  log_user_in,
  check_email_verification,
  send_password_reset_email,
  resend_verification_email,
} from "Store/user/thinks";

const HomeContainer = () => {
  const { user } = useSelector((state) => state);

  if (user.data?.emailVerified === true) {
    return <Redirect to="/projects" />;
  }

  return (
    <PageContainer id="home" pageContainerClassName="home" header={false}>
      <RegistrationLogin />
    </PageContainer>
  );
};

const RegistrationLogin = () => {
  const { user } = useSelector((state) => state);

  if (user.data?.emailVerified === true) {
    return <Redirect to="/projects" />;
  }

  if (user.data && !user.data.emailVerified) {
    return <PleaseVerifyYourEmail />;
  }

  return <Form />;
};

const Form = () => {
  const [is_password_reset_screen, set_is_password_reset_screen] = useState(
    false
  );
  const [mode, set_mode] = useState("login");
  const toggle_mode = () =>
    set_mode(mode === "login" ? "registration" : "login");
  const {
    first_name_input_value,
    last_name_input_value,
    email_input_value,
    password_input_value,
    is_registration_request_busy,
    is_signin_request_busy,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const first_name_input_change_handler = (e) => {
    const { value } = e.detail;

    dispatch(set_input_value("first_name")(value));
  };
  const last_name_input_change_handler = (e) => {
    const { value } = e.detail;

    dispatch(set_input_value("last_name")(value));
  };
  const email_input_change_handler = (e) => {
    const trimmed = e.detail.value.trim();

    dispatch(set_input_value("email")(trimmed));
  };
  const password_input_change_handler = (e) => {
    const trimmed = e.detail.value.trim();

    dispatch(set_input_value("password")(trimmed));
  };
  const submit_handler = (e) => {
    e.preventDefault();

    dispatch(mode === "registration" ? register_user() : log_user_in());
  };
  const password_regex = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$";
  const autofocus_ref = useRef();

  useLayoutEffect(() => {
    setTimeout(() => {
      if (autofocus_ref.current) {
        const input_node = autofocus_ref.current.querySelector("input");

        if (input_node) {
          input_node.focus();
        }
      }
    }, 200);
  }, [autofocus_ref, mode, is_password_reset_screen]);

  return is_password_reset_screen ? (
    <PasswordReset
      email_input_value={email_input_value}
      email_input_change_handler={email_input_change_handler}
      set_is_password_reset_screen={set_is_password_reset_screen}
      autofocus_ref={autofocus_ref}
    />
  ) : (
    <>
      <div className="page-top">
        <IonImg className="logo" src="/assets/images/studio-h-logo.jpg" />
      </div>
      {mode === "login" ? (
        <LoginForm
          email_input_value={email_input_value}
          email_input_change_handler={email_input_change_handler}
          password_input_value={password_input_value}
          password_input_change_handler={password_input_change_handler}
          password_regex={password_regex}
          submit_handler={submit_handler}
          is_form_busy={is_signin_request_busy}
          toggle_mode={toggle_mode}
          autofocus_ref={autofocus_ref}
          set_is_password_reset_screen={set_is_password_reset_screen}
        />
      ) : (
        <RegistrationForm
          first_name_input_value={first_name_input_value}
          first_name_input_change_handler={first_name_input_change_handler}
          last_name_input_value={last_name_input_value}
          last_name_input_change_handler={last_name_input_change_handler}
          email_input_value={email_input_value}
          email_input_change_handler={email_input_change_handler}
          password_input_value={password_input_value}
          password_input_change_handler={password_input_change_handler}
          password_regex={password_regex}
          submit_handler={submit_handler}
          is_form_busy={is_registration_request_busy}
          toggle_mode={toggle_mode}
          autofocus_ref={autofocus_ref}
        />
      )}
    </>
  );
};

const LoginForm = ({
  email_input_value,
  email_input_change_handler,
  password_input_value,
  password_input_change_handler,
  password_regex,
  submit_handler,
  is_form_busy,
  toggle_mode,
  autofocus_ref,
  set_is_password_reset_screen,
}) => {
  return (
    <div className="form">
      <form onSubmit={submit_handler} className="login">
        <IonList lines="none">
          <IonListHeader>
            <h1 className="title">
              <span className="lead">Welcome to</span>
              <br />
              Let's Decorate
            </h1>
          </IonListHeader>
          <br />
          <IonItem>
            <IonLabel position="floating">
              Email<IonText color="primary">*</IonText>
            </IonLabel>
            <IonInput
              cssClass="field"
              placeholder="email"
              type="email"
              value={email_input_value}
              onIonChange={email_input_change_handler}
              disabled={is_form_busy}
              ref={autofocus_ref}
              autofocus
              required
            />
          </IonItem>
          <br />
          <IonItem>
            <IonLabel position="floating">
              Password<IonText color="primary">*</IonText>
            </IonLabel>
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
          </IonItem>
        </IonList>
        <IonButton
          fill="clear"
          size="small"
          color="dark"
          className="forgot-password"
          onClick={() => set_is_password_reset_screen(true)}
        >
          Forgot password?
        </IonButton>
        <br />
        <br />
        <IonButton
          expand="block"
          disabled={is_form_busy}
          type="submit"
          color="dark"
        >
          Log In
        </IonButton>
      </form>
      <br />
      <IonButton
        expand="full"
        fill="clear"
        color="primary"
        size="large"
        onClick={toggle_mode}
      >
        Create an account
      </IonButton>
    </div>
  );
};

const RegistrationForm = ({
  first_name_input_value,
  first_name_input_change_handler,
  last_name_input_value,
  last_name_input_change_handler,
  email_input_value,
  email_input_change_handler,
  password_input_value,
  password_input_change_handler,
  password_regex,
  submit_handler,
  is_form_busy,
  toggle_mode,
  autofocus_ref,
}) => {
  return (
    <div className="form">
      <form onSubmit={submit_handler} className="registration">
        <IonList lines="none">
          <IonListHeader>
            <h1 className="title">Create an account</h1>
          </IonListHeader>
          <br />
          <IonItem>
            <IonLabel position="floating">
              First Name<IonText color="primary">*</IonText>
            </IonLabel>{" "}
            <IonInput
              cssClass="field"
              placeholder="first name"
              type="text"
              value={first_name_input_value}
              onIonChange={first_name_input_change_handler}
              disabled={is_form_busy}
              ref={autofocus_ref}
              autofocus
              required
            />
          </IonItem>
          <br />
          <IonItem>
            <IonLabel position="floating">
              Last Name<IonText color="primary">*</IonText>
            </IonLabel>
            <IonInput
              cssClass="field"
              placeholder="last name"
              type="text"
              value={last_name_input_value}
              onIonChange={last_name_input_change_handler}
              disabled={is_form_busy}
              required
            />
          </IonItem>
          <br />
          <IonItem>
            <IonLabel position="floating">
              Email<IonText color="primary">*</IonText>
            </IonLabel>
            <IonInput
              cssClass="field"
              placeholder="email"
              type="email"
              value={email_input_value}
              onIonChange={email_input_change_handler}
              disabled={is_form_busy}
              required
            />
          </IonItem>
          <br />
          <IonItem>
            <IonLabel position="floating">
              Password<IonText color="primary">*</IonText>
            </IonLabel>
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
          </IonItem>
          <IonItem className="pw-tooltip">
            <IonText color="secondary">
              Minimum of eight characters in length with at least one uppercase
              letter, lowercase letter, and digit.
            </IonText>
          </IonItem>
          <br />
          <IonItem>
            <IonText className="terms" color="secondary">
              By creating an account, you agree to the
              <br />
              <a
                href="https://www.websitepolicies.com/policies/view/491ry5CQ"
                target="_blank"
              >
                Let's Decorate terms and conditions
              </a>
              .
            </IonText>
          </IonItem>
        </IonList>
        <IonButton
          expand="block"
          disabled={is_form_busy}
          type="submit"
          color="dark"
        >
          Create
        </IonButton>
      </form>
      <br />
      <IonButton
        expand="full"
        fill="clear"
        size="large"
        color="primary"
        onClick={toggle_mode}
      >
        Already have an account?
      </IonButton>
    </div>
  );
};

const PasswordReset = ({
  email_input_value,
  email_input_change_handler,
  set_is_password_reset_screen,
  autofocus_ref,
}) => {
  const [is_form_busy, set_is_form_busy] = useState(false);
  const [email_sent, set_email_sent] = useState(false);
  const dispatch = useDispatch();
  const success_callback = () => {
    set_is_form_busy(false);
    set_email_sent(true);
  };
  const failure_callback = () => {
    set_is_form_busy(false);
  };
  const submit_handler = (e) => {
    e.preventDefault();
    set_is_form_busy(true);
    dispatch(send_password_reset_email({ success_callback, failure_callback }));
  };

  return (
    <div className={`form reset-password ${email_sent && "email-sent"}`}>
      <span
        className="back-button"
        onClick={() => set_is_password_reset_screen(false)}
      >
        <IonIcon icon={arrowBackOutline} />
      </span>
      <form onSubmit={submit_handler} className={`password-reset`}>
        {email_sent ? (
          <EmailSentFormContent
            email_input_value={email_input_value}
            is_form_busy={is_form_busy}
            set_is_password_reset_screen={set_is_password_reset_screen}
          />
        ) : (
          <PasswordResetFormContent
            email_input_value={email_input_value}
            email_input_change_handler={email_input_change_handler}
            is_form_busy={is_form_busy}
            autofocus_ref={autofocus_ref}
          />
        )}
      </form>
    </div>
  );
};

const PasswordResetFormContent = ({
  email_input_value,
  email_input_change_handler,
  is_form_busy,
  autofocus_ref,
}) => {
  return (
    <>
      <br />
      <br />
      <IonList lines="none">
        <IonListHeader>
          <h1 className="title">Let's find your account</h1>
        </IonListHeader>
        <br />
        <IonItem>
          <IonLabel position="floating">
            Email<IonText color="primary">*</IonText>
          </IonLabel>
          <IonInput
            cssClass="field"
            placeholder="email"
            type="email"
            value={email_input_value}
            onIonChange={email_input_change_handler}
            disabled={is_form_busy}
            ref={autofocus_ref}
            autofocus
            required
          />
        </IonItem>
      </IonList>
      <br />
      <br />
      <br />
      <IonButton
        expand="block"
        disabled={is_form_busy}
        type="submit"
        color="dark"
      >
        Send a password reset email
      </IonButton>
    </>
  );
};

const EmailSentFormContent = ({
  email_input_value,
  is_form_busy,
  set_is_password_reset_screen,
}) => {
  return (
    <>
      <div>
        <h1 className="title">Email sent!</h1>
        <p>
          We sent a password reset email to{" "}
          <strong className="sent-to-email">{email_input_value}</strong> so you
          can reset your password.
        </p>
      </div>
      <div>
        <span>Didn't get the email?</span>
        <br />
        <IonButton
          expand="block"
          fill="outline"
          disabled={is_form_busy}
          type="submit"
          color="dark"
        >
          Try again
        </IonButton>
      </div>
      <IonButton
        expand="block"
        disabled={is_form_busy}
        type="button"
        color="dark"
        onClick={(e) => {
          e.preventDefault();
          set_is_password_reset_screen(false);
        }}
      >
        Back to login
      </IonButton>
    </>
  );
};

const PleaseVerifyYourEmail = () => {
  const [is_form_busy, set_is_form_busy] = useState(false);
  const [show_toast, set_show_toast] = useState(false);
  const { data } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const check_email_verification_handler = (e) =>
    dispatch(check_email_verification());

  const success_callback = () => {
    set_is_form_busy(false);
    set_show_toast(true);
  };
  const failure_callback = () => {
    set_is_form_busy(false);
  };
  const resend_verification_email_handler = (e) => {
    e.preventDefault();
    set_is_form_busy(true);
    dispatch(resend_verification_email({ success_callback, failure_callback }));
  };

  return (
    <div className="email-verification">
      <h1>Verification email sent</h1>
      <br />
      <p>
        A verification email has been sent to <strong>{data.username}</strong>.
        Please check your email, click the verification link in the verification
        email, then click the button below to proceed.
      </p>
      <br />
      <br />
      <br />
      <br />
      <IonButton
        color="dark"
        expand="block"
        onClick={check_email_verification_handler}
        disabled={is_form_busy}
      >
        Email Verified
      </IonButton>
      <br />
      <br />
      <br />
      <br />
      <span>Didn't get the email?</span>
      <IonButton
        color="dark"
        expand="block"
        fill="outline"
        onClick={resend_verification_email_handler}
        disabled={is_form_busy}
      >
        Resend Verification Email
      </IonButton>
      <br />
      <IonButton
        color="primary"
        expand="block"
        fill="outline"
        onClick={() => {
          window.localStorage.clear();
          window.sessionStorage.clear();
          window.location.reload();
        }}
        disabled={is_form_busy}
      >
        Use a different email address
      </IonButton>
      {show_toast && (
        <IonToast
          isOpen={true}
          header="Verification email sent"
          message="Another verification email was successfully sent."
          duration={2000}
          position="top"
          buttons={[
            {
              text: "OK",
              role: "cancel",
            },
          ]}
          onDidDismiss={() => setTimeout(() => set_show_toast(false), 200)}
        />
      )}
    </div>
  );
};

export default HomeContainer;
