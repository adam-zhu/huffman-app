import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useRouteMatch } from "react-router-dom";
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
import { get_project, begin_new_consultation } from "Store/project/thinks";
import { inches_to_feet } from "Utils";

const Project = () => {
  const { data, new_consultation } = useSelector(
    (root_state) => root_state.project
  );
  const match = useRouteMatch();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_project(match.params.project_objectId));
  }, [match.params.project_objectId]);

  if (new_consultation !== undefined) {
    return <Redirect to={`/consultation/${new_consultation.objectId}`} />;
  }

  return (
    <PageContainer className="project-page-container">
      {data === undefined ? (
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
  const { data } = useSelector((state) => state.project);
  const { name, description, room_width, room_length, room_height } = data;

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
  const { project, user } = useSelector((state) => state);
  const { data, consultation_creation_busy } = project;
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
          <IonText>
            <span className="count">
              <strong>
                <IonText
                  color={
                    data.consultations.length >=
                    data.package.amount_of_included_consultations
                      ? "danger"
                      : "dark"
                  }
                >
                  {data.consultations.length}
                </IonText>
              </strong>{" "}
              / {data.package.amount_of_included_consultations}
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
              data.consultations.length >=
                data.package.amount_of_included_consultations
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
        ? open_consultations
            .sort(byUpdatedAt)
            .map((c) => <ConsultationRow key={c.objectId} consultation={c} />)
        : "none"}
      {closed_consultations.length > 0 && (
        <>
          <IonRow>
            <h6>Closed Consultations:</h6>
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
        color={consultation.is_open ? "dark" : "medium"}
        routerLink={{
          pathname: `/consultation/${consultation.objectId}`,
          state: consultation,
        }}
        disabled={consultation.is_open === false}
      >
        last active:{" "}
        {formatRelative(new Date(consultation.updatedAt), new Date())}
      </IonButton>
    </IonRow>
  );
};

export default Project;
