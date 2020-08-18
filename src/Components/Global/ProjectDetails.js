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
  IonButton,
} from "@ionic/react";
import "Styles/Global/ProjectDetails.scss";
import { inches_to_feet } from "Utils";
import { select_project_data } from "Store/projects/selectors";
import HorizontalScrollThumbnailGallery from "Components/Global/HorizontalScrollThumbnailGallery";

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
          <IonRow className="top">
            <h1 className="name">{name}</h1>
            <IonButton
              className="questionnaire"
              size="small"
              fill="outline"
              routerLink={`/questionnaire/${project_data.objectId}`}
            >
              Questionnaire &rarr;
            </IonButton>
          </IonRow>
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
        {project_images?.length > 0 && (
          <>
            <br />
            <HorizontalScrollThumbnailGallery images={project_images} />
          </>
        )}
      </IonGrid>
    </>
  );
};

export default ProjectDetails;
