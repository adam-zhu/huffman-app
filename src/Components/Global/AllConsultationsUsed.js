import React, { useState } from "react";
import {
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
} from "@ionic/react";
import { chatbubbleEllipsesOutline } from "ionicons/icons";
import "Styles/Global/AllConsultationsUsed.scss";

const AllConsultationsUsed = ({ project_data }) => {
  const [is_expanded, set_is_expanded] = useState(false);

  return (
    <IonCard
      className={`all-consultations-used`}
      onClick={() => set_is_expanded(!is_expanded)}
      button
    >
      <IonCardHeader className="card-header">
        <div className="flex-container">
          <div className="icon-container">
            <IonIcon icon={chatbubbleEllipsesOutline} />
          </div>
          <div className="copy">
            <strong>You've used all of your consultations</strong>
            <br />
            <span className="see-options">
              {is_expanded
                ? "Click again to hide options"
                : "Click to see your options"}
            </span>
          </div>
        </div>
      </IonCardHeader>
      {is_expanded && (
        <IonCardContent className="card-content">
          <IonButton
            routerLink={`/more_consultations/${project_data.objectId}`}
            expand="block"
            fill="outline"
            color="primary"
          >
            Purchase a new package &rarr;
          </IonButton>
          or
          <IonButton
            routerLink={`/new`}
            expand="block"
            fill="outline"
            color="secondary"
          >
            Begin a new project &rarr;
          </IonButton>
        </IonCardContent>
      )}
    </IonCard>
  );
};

export default AllConsultationsUsed;
