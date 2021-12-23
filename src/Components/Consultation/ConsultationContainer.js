import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch, useHistory, useLocation } from "react-router-dom";
import { IonToast, IonSkeletonText } from "@ionic/react";
import PageContainer from "Components/Global/PageContainer";
import "Styles/Consultation/ConsultationContainer.scss";
import Messages from "./Messages";
import {
  select_project_data,
  select_consultation_data,
} from "Store/projects/selectors";
import ProjectDetails from "Components/Global/ProjectDetails";

const ConsultationContainer = () => {
  const state = useSelector((state) => state);
  const match = useRouteMatch();
  const project_data = select_project_data({ state, match });
  const consultation_data = select_consultation_data({ state, match });

  return (
    <>
      <PageContainer id="consultation" pageContainerClassName="consultation">
        {project_data === undefined || consultation_data === undefined ? (
          <IonSkeletonText animated />
        ) : (
          <>
            <div className="project-meta">
              <ProjectDetails
                project_data={project_data}
                hide_title
                consultation_name={consultation_data.name}
              />
            </div>
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
      <div className="messages-container">
        <Messages />
      </div>
      {show_toast && (
        <ConsultationClosed
          message={`This consultation has been closed. Redirecting back to ${project_data.name}...`}
          toast_duration={toast_duration}
        />
      )}
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
