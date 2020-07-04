import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import {
  IonGrid,
  IonRow,
  IonChip,
  IonLabel,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonImg,
} from "@ionic/react";
import "Styles/Project/ProjectDetails.scss";
import { inches_to_feet } from "Utils";
import { select_project_data } from "Store/projects/selectors";
import Modal from "Components/Global/Modal";

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
  const [image_modal_src, set_image_modal_src] = useState(null);

  if (project_data === undefined) {
    return <IonSkeletonText animated />;
  }

  return (
    <IonGrid className="project-details">
      {hide_title !== true && (
        <IonRow>
          <h2 className="name">{name}</h2>
        </IonRow>
      )}
      {project_images?.length > 0 && (
        <IonRow className="images">
          <div className="inner">
            {project_images.map((p, index) => {
              return (
                <IonThumbnail
                  className="thumb"
                  key={index + p}
                  onClick={() => set_image_modal_src(p.image.url)}
                >
                  <IonImg src={p.image.url} />
                </IonThumbnail>
              );
            })}
          </div>
        </IonRow>
      )}
      {image_modal_src !== null && (
        <Modal
          close_handler={() => set_image_modal_src(null)}
          className="enlarge-image"
        >
          <IonImg className="image" src={image_modal_src} />
        </Modal>
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
  );
};

export default ProjectDetails;
