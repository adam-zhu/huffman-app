import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonChip,
  IonLabel,
  IonSkeletonText,
  IonText,
} from "@ionic/react";
import { formatRelative } from "date-fns";
import PageContainer from "Components/Global/PageContainer";
import "Styles/Project.scss";
import { begin_new_consultation } from "Store/project/thinks";
import { inches_to_feet } from "Utils";
import { select_project_data } from "Store/projects/selectors";
import { get_open_closed } from "Store/projects/utils";

const ProjectContainer = () => {
  const { projects } = useSelector((state) => state);

  return (
    <PageContainer className="project-page-container">
      {projects.data_loaded === false ? (
        <IonSkeletonText animated />
      ) : (
        <>
          <ProjectDetails />
          <ProjectConsultations />
        </>
      )}
    </PageContainer>
  );
};

const ProjectDetails = () => {
  const state = useSelector((state) => state);
  const match = useRouteMatch();
  const project_data = select_project_data({ state, match });
  const { name, description, room_width, room_length, room_height } =
    project_data || {};

  if (project_data === undefined) {
    return <IonSkeletonText animated />;
  }

  return (
    <IonGrid className="project-details">
      <IonRow>
        <h2 className="name">{name}</h2>
      </IonRow>
      <IonRow>
        <p className="description">{description}</p>
      </IonRow>
      <IonRow className="room-dimensions">
        <IonChip>
          <IonLabel>Width {inches_to_feet(room_width)}'</IonLabel>
        </IonChip>
        <IonChip>
          <IonLabel>Length {inches_to_feet(room_length)}'</IonLabel>
        </IonChip>
        <IonChip>
          <IonLabel>Height {inches_to_feet(room_height)}'</IonLabel>
        </IonChip>
      </IonRow>
    </IonGrid>
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
      <IonRow>
        <h6>Open Consultations:</h6>
      </IonRow>
      {open_consultations.length > 0
        ? open_consultations.map((c) => (
            <ConsultationRow key={c.objectId} consultation={c} />
          ))
        : "none"}
      {closed_consultations.length > 0 && (
        <>
          <IonRow>
            <h6>Closed Consultations:</h6>
          </IonRow>
          {closed_consultations.map((c) => (
            <ConsultationRow
              key={c.objectId}
              consultation={c}
              disabled={state.user.data.is_admin === false}
            />
          ))}
        </>
      )}
    </IonGrid>
  );
};

const ConsultationRow = ({ consultation }) => {
  return (
    <IonRow>
      <IonButton
        expand="block"
        color={consultation.is_open ? "dark" : "medium"}
        routerLink={{
          pathname: `/projects/${consultation.project.objectId}/${consultation.objectId}`,
          state: consultation,
        }}
        disabled={consultation.is_open === false}
      >
        last active:{" "}
        {formatRelative(new Date(consultation.last_active_date), new Date())}
      </IonButton>
    </IonRow>
  );
};

export default ProjectContainer;
