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
import { formatRelative } from "date-fns";
import PageContainer from "Components/Global/PageContainer";
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
        <h2 className="name">{data?.name}</h2>
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
  const { project, user } = useSelector((state) => state);
  const { data, consutlation_creation_busy } = project;
  const consultations = data?.consultations || [];
  const [open_consultations, closed_consultations] = consultations.reduce(
    (acc, c) =>
      c.is_open ? [acc[0].concat([c]), acc[1]] : [acc[0], acc[1].concat([c])],
    [[], []]
  );
  const byUpdatedAt = (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt);
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
      </IonRow>
      <IonRow>
        <IonButton
          className="new-consultation"
          expand="block"
          onClick={new_consultation_handler}
          disabled={consutlation_creation_busy}
        >
          Begin new consultation
        </IonButton>
      </IonRow>
      <IonRow>
        <hr />
      </IonRow>
      <IonRow>
        <h5>Open Consultations:</h5>
      </IonRow>
      {open_consultations.length > 0
        ? open_consultations
            .sort(byUpdatedAt)
            .map((c) => <ConsultationRow key={c.objectId} consultation={c} />)
        : "none"}
      {closed_consultations.length > 0 && (
        <>
          <IonRow>
            <h5>Closed Consultations:</h5>
          </IonRow>
          {closed_consultations.sort(byUpdatedAt).map((c) => (
            <ConsultationRow
              key={c.objectId}
              consultation={c}
              disabled={user.data.is_admin === false}
            />
          ))}
        </>
      )}
    </IonGrid>
  );
};

const ConsultationRow = ({ consultation }) => {
  const { data } = useSelector((root_state) => root_state.project);

  return (
    <IonRow>
      <IonButton
        expand="block"
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
