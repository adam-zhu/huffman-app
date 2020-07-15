import React from "react";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import {
  IonGrid,
  IonRow,
  IonChip,
  IonLabel,
  IonSkeletonText,
  IonText,
} from "@ionic/react";
import "Styles/Project/ProjectDetails.scss";
import { inches_to_feet } from "Utils";
import { select_project_data } from "Store/projects/selectors";
import ThumbnailGallery from "Components/Global/ThumbnailGallery";

const ProjectDetails = ({ hide_title }) => {
  const state = useSelector((state) => state);
  const match = useRouteMatch();
  const project_data = select_project_data({ state, match });
  const {
    name,
    description,
    room_width,
    room_length,
    room_height,
    project_images,
  } = project_data || {};

  if (project_data === undefined) {
    return <IonSkeletonText animated />;
  }

  return (
    <>
      <IonGrid className="project-details">
        {hide_title !== true && (
          <IonRow>
            <h2 className="name">{name}</h2>
          </IonRow>
        )}
        <IonGrid />
        {project_images?.length > 0 && (
          <ThumbnailGallery images={project_images} />
        )}
        <IonRow>
          <IonText>
            <p className="description">{description}</p>
          </IonText>
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
    </>
  );
};

export default ProjectDetails;
