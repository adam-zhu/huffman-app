import React from "react";
import "Styles/Global/PackagePreviewCard.scss";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from "@ionic/react";
import { to_dollars_cents } from "Utils";

const PackagePreviewCard = ({ package_data, ...rest }) => {
  const { dollars, cents } = to_dollars_cents(package_data.price_cents);

  return (
    <IonCard
      className={`package-preview-card ${rest.className ? rest.className : ""}`}
      style={{
        ...rest.style,
        backgroundImage: `url(${package_data.image.url})`,
      }}
      {...rest}
    >
      <IonCardHeader className="title">
        <IonCardTitle>{package_data.name}</IonCardTitle>
        <IonCardSubtitle>
          {package_data.included_consultations_count} CONSULTATIONS
        </IonCardSubtitle>
        <span className="price">
          $<strong>{dollars}</strong>.<span>{cents}</span>
        </span>
      </IonCardHeader>
    </IonCard>
  );
};

export default PackagePreviewCard;
