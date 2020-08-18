import React from "react";
import "Styles/Global/PackagePreviewCard.scss";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from "@ionic/react";
import { to_dollars_cents } from "Utils";

const PackagePreviewCard = ({ package_data, click_handler }) => {
  const { dollars, cents } = to_dollars_cents(package_data.price_cents);

  return (
    <IonCard
      button
      onClick={typeof click_handler === "function" ? click_handler : () => {}}
      className="package-preview-card"
      routerLink={`/packages?package_objectId=${package_data.objectId}`}
      style={{ backgroundImage: `url(${package_data.image.url})` }}
    >
      <IonCardHeader className="title">
        <IonCardTitle>{package_data.name}</IonCardTitle>
        <IonCardSubtitle>
          {package_data.amount_of_included_consultations} CONSULTATIONS
        </IonCardSubtitle>
        <span className="price">
          $<strong>{dollars}</strong>.<span>{cents}</span>
        </span>
      </IonCardHeader>
    </IonCard>
  );
};

export default PackagePreviewCard;
