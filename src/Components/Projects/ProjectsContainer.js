import React from "react";
import { useSelector } from "react-redux";
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

const ProjectsContainer = () => {
  const { data, loading } = useSelector((state) => state.projects);

  return (
    <PageContainer className="projects-page-container">
      <div className="page-top">
        <h1>Projects</h1>
        <IonButton fill="outline" routerLink="/projects/new">
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
    <IonCard type="button" routerLink={`/projects/${project.objectId}`}>
      <IonCardHeader>
        <IonCardSubtitle>{project.created_by.username}</IonCardSubtitle>
        <IonCardTitle>{project.name}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent></IonCardContent>
    </IonCard>
  );
};

export default ProjectsContainer;
