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
  IonIcon,
} from "@ionic/react";
import { ellipse } from "ionicons/icons";
import "Styles/Projects/ProjectsContainer.scss";

const ProjectsContainer = () => {
  const { user, projects } = useSelector((state) => state);
  const projects_element = projects.data?.length ? (
    <>{user.data?.is_admin ? <AdminProjectsList /> : <RegularProjectsList />}</>
  ) : null;

  return (
    <PageContainer
      id={`projects`}
      ionContentClassName={
        projects.data?.length > 0 ? `has-projects` : `no-projects`
      }
      pageContainerClassName="projects"
    >
      {!user.data?.is_admin && (
        <div className="top">
          {!projects.data?.length && <br />}
          <h1 className="page-title">
            {!projects.data?.length && (
              <>
                <span>Hi {user.data?.first_name}</span>
                <br />
              </>
            )}
            Let's decorate
          </h1>
          {!projects.data?.length && <br />}
          <NewProjectButton />
        </div>
      )}
      {projects_element}
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
  const isPaid = (p) =>
    p.paid && (p.packages || []).find((_p) => _p.paid === true) !== undefined;

  return (
    <div className="admin-projects-container">
      <h1>Let's decorate</h1>
      {loading || !data ? (
        <IonSkeletonText animated />
      ) : (
        data
          .filter(isPaid)
          .map((p) => <AdminProjectCard project={p} key={p.objectId} />)
      )}
    </div>
  );
};

const RegularProjectsList = () => {
  const { data, loading } = useSelector((state) => state.projects);
  const isPaid = (p) =>
    p.paid && (p.packages || []).find((_p) => _p.paid === true) !== undefined;

  return (
    <div className="regular-projects-container">
      <h3>Recent projects</h3>
      <div className="horiz-scroll-container">
        {loading || !data ? (
          <IonSkeletonText animated />
        ) : (
          data
            .filter(isPaid)
            .map((p) => <ProjectPreviewCard project={p} key={p.objectId} />)
        )}
      </div>
    </div>
  );
};

const AdminProjectCard = ({ project }) => {
  const project_images = project.project_images || [];
  const has_new_messages = (project.consultations || [])
    .flatMap(({ messages }) => messages || [])
    .find(({ admin_viewed }) => !admin_viewed);

  return (
    <IonCard
      type="button"
      routerLink={`/projects/${project.objectId}`}
      className="admin-project-card"
    >
      {has_new_messages && (
        <IonIcon icon={ellipse} size="small" className="new-indicator" />
      )}
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
  const has_details =
    project_images.length > 0 &&
    project.room_width > 0 &&
    project.room_height > 0 &&
    project.room_length > 0;
  const has_new_messages = (project.consultations || [])
    .flatMap(({ messages }) => messages || [])
    .find(({ user_viewed }) => !user_viewed);
  const href = has_details
    ? `/projects/${project.objectId}`
    : `/add_details/${project.objectId}`;

  return (
    <IonCard type="button" routerLink={href} className="project-preview-card">
      <div className="inner">
        {has_new_messages && (
          <div className="new">
            <IonIcon icon={ellipse} size="small" className="new-indicator" />
          </div>
        )}
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
