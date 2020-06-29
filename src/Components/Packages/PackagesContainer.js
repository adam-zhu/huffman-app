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
} from "@ionic/react";
import "Styles/Projects.scss";
import { get_projects } from "Store/projects/thinks";

const Projects = () => {
  const { data } = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_projects());
  }, []);

  return (
    <PageContainer className="projects-page-container">
      <div className="page-top">
        <h1>Projects</h1>
        <IonButton routerLink="/new_project">New Project</IonButton>
      </div>
      {(data || []).map((p) => (
        <ProjectCard project={p} key={p.objectId} />
      ))}
    </PageContainer>
  );
};

const ProjectCard = ({ project }) => {
  return (
    <IonCard type="button" routerLink={`/projects/${project.objectId}`}>
      <IonCardHeader>
        <IonCardSubtitle>{project.created_by.username}</IonCardSubtitle>
        <IonCardTitle>{project.name}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent></IonCardContent>
    </IonCard>
  );
};

export default Projects;
