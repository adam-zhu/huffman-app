import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch, useHistory, useLocation } from "react-router-dom";
import qs from "query-string";
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
  IonToast,
} from "@ionic/react";
import { formatRelative } from "date-fns";
import PageContainer from "Components/Global/PageContainer";
import "Styles/Project/ProjectContainer.scss";
import { begin_new_consultation } from "Store/project/thinks";
import { select_project_data } from "Store/projects/selectors";
import { get_open_closed } from "Store/projects/utils";
import ProjectDetails from "Components/Global/ProjectDetails";
import AllConsultationsUsed from "Components/Global/AllConsultationsUsed";

const ProjectContainer = () => {
  const state = useSelector((state) => state);
  const { projects } = state;
  const match = useRouteMatch();
  const project_data = select_project_data({ state, match });

  return (
    <PageContainer id="project" pageContainerClassName="project">
      {projects.data_loaded === false ? (
        <IonSkeletonText animated />
      ) : (
        <>
          <Toasts project_data={project_data} />
          <ProjectDetails project_data={project_data} />
          <ConsultationsCountAndCTA project_data={project_data} />
          <ProjectConsultations project_data={project_data} />
        </>
      )}
    </PageContainer>
  );
};

const Toasts = ({ project_data }) => {
  const { search } = useLocation();
  const url_query_params = qs.parse(search);
  const most_recent_package_consultations_count =
    project_data && project_data.packages && project_data.packages.length > 0
      ? project_data.packages[project_data.packages.length - 1]
          .included_consultations_count
      : null;

  return (
    <>
      {url_query_params.new_project && (
        <IonToast
          className="new-project-toast"
          isOpen={true}
          header="Welcome to your new project!"
          message="Open a consultation below to get started."
          duration={4000}
          position="top"
          buttons={[
            {
              text: "OK",
              role: "cancel",
            },
          ]}
        />
      )}
      {url_query_params.more_consultations && (
        <IonToast
          className="more-consultations-toast"
          isOpen={true}
          header="Consultations added!"
          message={`${most_recent_package_consultations_count} consultation${
            most_recent_package_consultations_count > 1 ? "s" : ""
          } have been added to your project.`}
          duration={4000}
          position="top"
          buttons={[
            {
              text: "OK",
              role: "cancel",
            },
          ]}
        />
      )}
    </>
  );
};

const ConsultationsCountAndCTA = ({ project_data }) => {
  const state = useSelector((state) => state);
  const { consultation_creation_busy } = state.project;
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const new_consultation_handler = () =>
    dispatch(
      begin_new_consultation({
        history,
        project_objectId: match.params.project_objectId,
      })
    );

  if (project_data === undefined) {
    return <IonSkeletonText animated />;
  }

  const included_consultations_count = project_data.packages
    ? project_data.packages.reduce(
        (acc, p) => acc + p.included_consultations_count,
        0
      )
    : null;

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
                    included_consultations_count
                      ? "danger"
                      : "dark"
                  }
                >
                  {project_data.consultations.length}
                </IonText>
              </strong>{" "}
              / {included_consultations_count}
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
              project_data.consultations.length >= included_consultations_count
            }
          >
            Begin new consultation &rarr;
          </IonButton>
        </IonCol>
      </IonRow>
      {project_data.consultations.length >= included_consultations_count && (
        <IonRow>
          <AllConsultationsUsed project_data={project_data} />
        </IonRow>
      )}
    </IonGrid>
  );
};

const ProjectConsultations = ({ project_data }) => {
  if (project_data === undefined) {
    return <IonSkeletonText animated />;
  }

  const [open_consultations, closed_consultations] = get_open_closed(
    project_data.consultations
  );

  return (
    <>
      <IonList lines="inset">
        <IonListHeader className="open-consultations">
          Consultations
        </IonListHeader>
        {open_consultations.length > 0 ? (
          open_consultations.map((c) => (
            <ConsultationRow key={c.objectId} consultation={c} />
          ))
        ) : (
          <IonItem>
            <IonText className="empty-state">none</IonText>
          </IonItem>
        )}
      </IonList>
      {closed_consultations.length > 0 && (
        <>
          <br />
          <IonList lines="inset">
            <IonListHeader className="closed-consultations">
              Closed
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
        last active:
        <strong className="time">
          {formatRelative(new Date(consultation.last_active_date), new Date())}
        </strong>
      </IonText>
    </IonItem>
  );
};

export default ProjectContainer;
