import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonChip,
  IonLabel,
} from "@ionic/react";
import PageContainer from "Components/Global/PageContainer";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import "Styles/Project.scss";
import { get_project, begin_new_consultation } from "Store/project/thinks";

const Project = ({ match }) => {
  const { data, new_consultation } = useSelector(
    (root_state) => root_state.project
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_project(match.params.project_objectId));
  }, [match.params.project_objectId]);

  if (new_consultation !== undefined) {
    return (
      <Redirect
        to={{
          pathname: `/consultation/${new_consultation.objectId}`,
          state: new_consultation,
        }}
      />
    );
  }

  return (
    <PageContainer className="project-page-container">
      <ProjectDetails />
      <ProjectConsultations />
    </PageContainer>
  );
};

const ProjectDetails = () => {
  const { data } = useSelector((state) => state.project);

  return (
    <IonGrid className="project-details">
      <IonRow>
        <strong className="name">{data?.name}</strong>
      </IonRow>
      <IonRow>
        <p className="description">{data?.description}</p>
      </IonRow>
      <IonRow className="room-dimensions">
        <IonChip>
          <IonLabel>Width {data?.room_width} in</IonLabel>
        </IonChip>
        <IonChip>
          <IonLabel>Length {data?.room_length} in</IonLabel>
        </IonChip>
        <IonChip>
          <IonLabel>Height {data?.room_height} in</IonLabel>
        </IonChip>
      </IonRow>
    </IonGrid>
  );
};

const ProjectConsultations = () => {
  const { data, consutlation_creation_busy } = useSelector(
    (state) => state.project
  );
  const consultations = data?.consultations || [];
  const dispatch = useDispatch();
  const new_consultation_handler = () => dispatch(begin_new_consultation());

  return (
    <IonGrid>
      <IonRow>
        <IonCol className="consultation-count">
          <strong>{data?.consultations.length}</strong> /{" "}
          <span>
            {data?.package?.amount_of_included_consultations} consultations used
          </span>
        </IonCol>
        <IonCol className="ion-align-self-end new-consultation">
          <IonButton
            className="new-consultation"
            onClick={new_consultation_handler}
            disabled={consutlation_creation_busy}
          >
            Begin new consultation
          </IonButton>
        </IonCol>
      </IonRow>
      <IonRow>Previous Consultations:</IonRow>
      {consultations.length > 0
        ? consultations
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .map((c) => <ConsultationRow key={c.objectId} consultation={c} />)
        : "none"}
    </IonGrid>
  );
};

const ConsultationRow = ({ consultation }) => {
  const { data } = useSelector((root_state) => root_state.project);

  return (
    <IonRow>
      <IonButton
        expand="block"
        fill="outline"
        color="dark"
        routerLink={{
          pathname: `/consultation/${consultation.objectId}`,
          state: consultation,
        }}
      >
        last active:{" "}
        {formatRelative(new Date(consultation.updatedAt), new Date())}
      </IonButton>
    </IonRow>
  );
};

export default Project;
