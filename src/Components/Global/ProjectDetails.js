import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouteMatch, useHistory, useLocation } from "react-router-dom";
import {
  IonGrid,
  IonRow,
  IonChip,
  IonLabel,
  IonSkeletonText,
  IonText,
  IonButton,
  IonInput,
  IonIcon,
  IonModal,
} from "@ionic/react";
import { createOutline } from "ionicons/icons";
import "Styles/Global/ProjectDetails.scss";
import { inches_to_feet } from "Utils";
import HorizontalScrollThumbnailGallery from "Components/Global/HorizontalScrollThumbnailGallery";
import { edit_consultation_name } from "Store/project/thinks";

const ProjectDetails = ({ project_data, hide_title, consultation_data }) => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [consultationName, setConsultationName] = useState(null);

  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    if (consultation_data) {
      setConsultationName(consultation_data.name);
    }
  }, []);

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

  const edit_consultation_name_handler = () =>
    dispatch(
      edit_consultation_name({
        history,
        project_objectId: match.params.project_objectId,
        consultation_objectId: consultation_data.objectId,
        consultation_name: consultationName,
      })
    );

  return (
    <>
      <IonModal
        isOpen={modalVisibility}
        cssClass="consultation-name-modal"
        onDidDismiss={() => setModalVisibility(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setModalVisibility(false);
            setConsultationName(null);
            edit_consultation_name_handler();
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <IonLabel style={{ padding: 10, fontSize: 25 }}>
            Edit consultation name
          </IonLabel>
          <IonInput
            placeholder="Enter consultation name"
            type="text"
            onIonChange={(e) => setConsultationName(e.detail.value)}
            value={consultationName}
            required
          />
          <div style={{ textAlign: "center" }}>
            <IonButton type="submit">Save</IonButton>
            <IonButton type="button" onClick={() => setModalVisibility(false)}>
              Cancel
            </IonButton>
          </div>
        </form>
      </IonModal>

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
        {consultation_data ? (
          <IonRow
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <IonButton
              style={{ marginRight: 10 }}
              class="edit-button"
              onClick={() => setModalVisibility(true)}
            >
              <IonIcon color="light" size="large" icon={createOutline} />
            </IonButton>
            <h1>{consultation_data.name}</h1>
          </IonRow>
        ) : null}
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
            <HorizontalScrollThumbnailGallery images={project_images} />
          </>
        )}
      </IonGrid>
    </>
  );
};

export default ProjectDetails;
