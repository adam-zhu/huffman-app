import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonSkeletonText,
  IonText,
  IonList,
  IonListHeader,
  IonItem,
} from "@ionic/react";
import { formatRelative } from "date-fns";
import PageContainer from "Components/Global/PageContainer";
import "Styles/Project/ProjectContainer.scss";
import { begin_new_consultation } from "Store/project/thinks";
import { select_project_data } from "Store/projects/selectors";
import { get_open_closed } from "Store/projects/utils";
import ProjectDetails from "Components/Global/ProjectDetails";

const ProjectContainer = () => {
  const { projects } = useSelector((state) => state);

  return (
    <PageContainer className="project-page-container">
      {projects.data_loaded === false ? (
        <IonSkeletonText animated />
      ) : (
        <>
          <ProjectDetails />
          <br />
          <ProjectConsultations />
        </>
      )}
    </PageContainer>
  );
};

const ProjectConsultations = () => {
  const state = useSelector((state) => state);
  const { consultation_creation_busy } = state.project;
  const match = useRouteMatch();
  const project_data = select_project_data({ state, match });
  const [open_consultations, closed_consultations] = get_open_closed(
    project_data?.consultations
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const { project_objectId } = match.params;
  const new_consultation_handler = () =>
    dispatch(begin_new_consultation({ history, project_objectId }));

  if (project_data === undefined) {
    return <IonSkeletonText animated />;
  }

  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol className="consultation-count">
            <IonText>
              <span className="count">
                <strong>
                  <IonText
                    color={
                      project_data.consultations.length >=
                      project_data.package.amount_of_included_consultations
                        ? "danger"
                        : "dark"
                    }
                  >
                    {project_data.consultations.length}
                  </IonText>
                </strong>{" "}
                / {project_data.package.amount_of_included_consultations}
              </span>
            </IonText>
            <br />
            <IonText color="medium">consultations used</IonText>
          </IonCol>
          <IonCol>
            <IonButton
              className="new-consultation"
              size="small"
              fill="outline"
              onClick={new_consultation_handler}
              disabled={
                consultation_creation_busy ||
                project_data.consultations.length >=
                  project_data.package.amount_of_included_consultations
              }
            >
              Begin new consultation &rarr;
            </IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <hr />
        </IonRow>
      </IonGrid>
      <IonList lines="inset">
        <IonListHeader className="open-consultations">
          Open Consultations
        </IonListHeader>
        {open_consultations.length > 0 ? (
          open_consultations.map((c) => (
            <ConsultationRow key={c.objectId} consultation={c} />
          ))
        ) : (
          <IonItem>
            <IonText>none</IonText>
          </IonItem>
        )}
      </IonList>
      {closed_consultations.length > 0 && (
        <>
          <br />
          <IonList lines="inset">
            <IonListHeader className="closed-consultations">
              Closed Consultations
            </IonListHeader>
            {closed_consultations.map((c) => (
              <ConsultationRow key={c.objectId} consultation={c} />
            ))}
          </IonList>
        </>
      )}
    </>
  );
};

const ConsultationRow = ({ consultation }) => {
  return (
    <IonItem
      button
      routerLink={{
        pathname: `/projects/${consultation.project.objectId}/${consultation.objectId}`,
        state: consultation,
      }}
    >
      <IonText>
        last active:{" "}
        {formatRelative(new Date(consultation.last_active_date), new Date())}
      </IonText>
    </IonItem>
  );
};

export default ProjectContainer;
