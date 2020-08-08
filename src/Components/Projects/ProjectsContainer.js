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
  IonThumbnail,
  IonImg,
} from "@ionic/react";
import "Styles/Projects/ProjectsContainer.scss";

const ProjectsContainer = () => {
  const { data, loading } = useSelector((state) => state.projects);

  return (
    <PageContainer className="projects-page-container">
      <div className="page-top">
        <h1>Projects</h1>
        <IonButton fill="outline" routerLink="/new">
          New project &rarr;
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
  const project_images = project.project_images || [];

  return (
    <IonCard type="button" routerLink={`/projects/${project.objectId}`}>
      <IonCardHeader>
        <IonCardSubtitle>{project.created_by.username}</IonCardSubtitle>
        <IonCardTitle>{project.name}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {project_images.length > 0 && (
          <div className="images">
            {project_images.map((p, i) => (
              <IonThumbnail className="thumb" key={i + p.image.url}>
                <IonImg src={p.image.url} />
              </IonThumbnail>
            ))}
          </div>
        )}
        <p>{project.description}</p>
      </IonCardContent>
    </IonCard>
  );
};

export default ProjectsContainer;
