import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageContainer from "Components/Global/PageContainer";
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
} from "@ionic/react";
import "Styles/Projects.scss";
import { get_projects } from "Store/projects/thinks";

const Projects = () => {
  const { data } = useSelector((root_state) => root_state.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_projects());
  }, []);

  return (
    <PageContainer>
      Projects
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
