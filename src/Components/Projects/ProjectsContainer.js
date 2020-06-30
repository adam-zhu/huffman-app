import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageContainer from "Components/Global/PageContainer";
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonSkeletonText,
} from "@ionic/react";
import "Styles/Projects.scss";
import { get_projects } from "Store/projects/thinks";

const Projects = () => {
  const { data, loading } = useSelector((root_state) => root_state.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_projects());
  }, []);

  return (
    <PageContainer className="projects-page-container">
      <div className="page-top">
        <h1>Projects</h1>
        <IonButton fill="outline" routerLink="/new_project">
          New Project &rarr;
        </IonButton>
      </div>
      {loading || data === undefined ? (
        <>
          <br />
          <IonSkeletonText animated />
        </>
      ) : (
        data.map((p) => <ProjectCard project={p} key={p.objectId} />)
      )}
    </PageContainer>
  );
};

const ProjectCard = ({ project }) => {
  return (
    <IonCard type="button" routerLink={`/project/${project.objectId}`}>
      <IonCardHeader>
        <IonCardSubtitle>{project.created_by.username}</IonCardSubtitle>
        <IonCardTitle>{project.name}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent></IonCardContent>
    </IonCard>
  );
};

export default Projects;
