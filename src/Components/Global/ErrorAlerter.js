import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IonModal, IonButton } from "@ionic/react";
import "Styles/ErrorAlerter.scss";
import { clear_app_errors } from "Store/errors/thinks";

const ErrorAlerter = () => {
  const { errors } = useSelector((state) => state);
  const dispatch = useDispatch();
  const dismiss_handler = (e) => {
    e.preventDefault();
    dispatch(clear_app_errors());
  };

  return errors.length === 0 ? null : (
    <IonModal isOpen cssClass="error-alerter">
      <form onSubmit={dismiss_handler}>
        <h1 className="header">
          <i className="material-icons">error</i> Error
        </h1>
        <ul>
          {errors.map((message, i) => (
            <li key={`${message}${i}`}>{message}</li>
          ))}
        </ul>
        <IonButton type="submit">OK</IonButton>
      </form>
    </IonModal>
  );
};

export default ErrorAlerter;
