import React from "react";
import { useSelector } from "react-redux";
import PageContainer from "Components/Global/PageContainer";
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonSkeletonText,
  IonThumbnail,
  IonImg,
} from "@ionic/react";
import "Styles/Projects/ProjectsContainer.scss";

const ProjectsContainer = () => {
  const { user } = useSelector((state) => state);

  return (
    <PageContainer className="projects-page-container">
      {!user.data?.is_admin && (
        <div className="top">
          <h1 className="page-title">Let's decorate</h1>
          <NewProjectButton />
        </div>
      )}
      {user.data?.is_admin ? <AdminProjectsList /> : <RegularProjectsList />}
    </PageContainer>
  );
};

const NewProjectButton = () => {
  return (
    <div className="new-project-button-container">
      <IonCard type="button" routerLink={`/new`} className="new-project-button">
        <h1>
          <span>Create</span>
          <br />
          new project
        </h1>
      </IonCard>
    </div>
  );
};

const AdminProjectsList = () => {
  const { data, loading } = useSelector((state) => state.projects);

  return (
    <div className="admin-projects-container">
      <h1>Let's decorate</h1>
      {loading || !data ? (
        <IonSkeletonText animated />
      ) : (
        data.map((p) => <AdminProjectCard project={p} key={p.objectId} />)
      )}
    </div>
  );
};

const RegularProjectsList = () => {
  const { data, loading } = useSelector((state) => state.projects);

  return (
    <div className="regular-projects-container">
      <h3>Recent projects</h3>
      <div className="horiz-scroll-container">
        {loading || !data ? (
          <IonSkeletonText animated />
        ) : (
          data.map((p) => <ProjectPreviewCard project={p} key={p.objectId} />)
        )}
      </div>
    </div>
  );
};

const AdminProjectCard = ({ project }) => {
  const project_images = project.project_images || [];

  return (
    <IonCard
      type="button"
      routerLink={`/projects/${project.objectId}`}
      className="admin-project-card"
    >
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

const ProjectPreviewCard = ({ project }) => {
  const project_images = project.project_images || [];

  return (
    <IonCard
      type="button"
      routerLink={`/projects/${project.objectId}`}
      className="project-preview-card"
    >
      <div className="inner">
        {project_images.length >= 1 && (
          <div className="image">
            <IonThumbnail className="thumb">
              <IonImg src={project_images[0].image.url} />
            </IonThumbnail>
          </div>
        )}
        <div className="meta">
          <strong className="name">{project.name}</strong>
          <p className="description">{project.description}</p>
        </div>
      </div>
    </IonCard>
  );
};

export default ProjectsContainer;
