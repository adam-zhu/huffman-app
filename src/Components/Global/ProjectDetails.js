import React from "react";
import {
  IonGrid,
  IonRow,
  IonChip,
  IonLabel,
  IonSkeletonText,
  IonText,
  IonButton,
} from "@ionic/react";
import "Styles/Global/ProjectDetails.scss";
import { inches_to_feet } from "Utils";
import HorizontalScrollThumbnailGallery from "Components/Global/HorizontalScrollThumbnailGallery";

const ProjectDetails = ({ project_data, hide_title, consultation_name }) => {
  if (project_data === undefined) {
    return <IonSkeletonText animated />;
  }

  const {
    name,
    description,
    room_width,
    room_length,
    room_height,
    project_images,
  } = project_data;

  return (
    <>
      <IonGrid className="project-details">
        {hide_title !== true && (
          <IonRow className="top">
            <h1 className="name">{name}</h1>
            <IonButton
              className="questionnaire"
              size="small"
              fill="outline"
              color="dark"
              routerLink={`/questionnaire/${project_data.objectId}`}
            >
              Questionnaire &rarr;
            </IonButton>
          </IonRow>
        )}
        <IonRow>
          <IonText>
            <h1>{consultation_name}</h1>
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
        {project_images?.length > 0 && (
          <>
            <HorizontalScrollThumbnailGallery images={project_images} />
          </>
        )}
      </IonGrid>
    </>
  );
};

export default ProjectDetails;
