import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch, useHistory, useLocation } from "react-router-dom";
import { IonToast, IonAlert, IonButton, IonSkeletonText } from "@ionic/react";
import PageContainer from "Components/Global/PageContainer";
import "Styles/Consultation/ConsultationContainer.scss";
import Messages from "./Messages";
import {
  select_project_data,
  select_consultation_data,
} from "Store/projects/selectors";
import { close_consultation } from "Store/consultation/thinks";
import ProjectDetails from "Components/Global/ProjectDetails";

const ConsultationContainer = () => {
  const state = useSelector((state) => state);
  const match = useRouteMatch();
  const consultation_data = select_consultation_data({ state, match });

  return (
    <>
      <PageContainer className="consultation-page-container">
        {consultation_data === undefined ? (
          <IonSkeletonText animated />
        ) : (
          <>
            <ProjectDetails hide_title />
            <br />
            <ConsultationMessages />
          </>
        )}
      </PageContainer>
    </>
  );
};

const ConsultationMessages = () => {
  const [
    initial_consultation_is_open,
    set_initial_consultation_is_open,
  ] = useState(undefined);
  const [show_toast, set_show_toast] = useState(false);
  const state = useSelector((state) => state);
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const project_data = select_project_data({ state, match });
  const consultation_data = select_consultation_data({ state, match });
  const project_objectId = project_data?.objectId;
  const toast_duration = 2400;

  useEffect(() => {
    set_initial_consultation_is_open(consultation_data.is_open);
  }, []);

  useEffect(() => {
    if (
      consultation_data.is_open === false &&
      initial_consultation_is_open === true
    ) {
      set_show_toast(true);

      setTimeout(
        () => history.push(`/projects/${project_data?.objectId}`),
        toast_duration
      );
    }
  }, [
    project_objectId,
    location.search.includes("closed"),
    consultation_data.is_open,
    initial_consultation_is_open,
  ]);

  return (
    <>
      <Messages />
      {state.user.data.is_admin === true && consultation_data.is_open && (
        <CloseConsultation />
      )}
      {show_toast && (
        <ConsultationClosed
          message={`This consultation has been closed. Redirecting back to ${project_data.name}...`}
          toast_duration={toast_duration}
        />
      )}
    </>
  );
};

const CloseConsultation = () => {
  const [
    is_confrim_close_consultation_modal_open,
    set_confirm_close_consultation_modal_open,
  ] = useState(false);
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const close_consultation_handler = () =>
    dispatch(close_consultation(match.params.consultation_objectId));

  return (
    <>
      <IonButton
        expand="block"
        type="button"
        color="danger"
        onClick={(e) => set_confirm_close_consultation_modal_open(true)}
      >
        Close Consultation
      </IonButton>
      <IonAlert
        isOpen={is_confrim_close_consultation_modal_open}
        message="Are you sure you want to close this consultation?"
        cssClass="confirm-consultation-close-modal"
        header="Close Consultation"
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: (e) => set_confirm_close_consultation_modal_open(false),
          },
          {
            text: "Close Consultation",
            cssClass: "primary",
            handler: close_consultation_handler,
          },
        ]}
      />
    </>
  );
};

const ConsultationClosed = ({ message, toast_duration }) => {
  return (
    <IonToast
      isOpen={true}
      header="Consultation Closed"
      message={message}
      duration={toast_duration}
      position="top"
      translucent
      buttons={[
        {
          text: "OK",
          role: "cancel",
        },
      ]}
    />
  );
};

export default ConsultationContainer;
