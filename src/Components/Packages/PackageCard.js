import React from "react";
import "Styles/Packages/PackageCard.scss";
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
} from "@ionic/react";
import { to_dollars_cents } from "Utils";

const PackageCard = ({ package_data, is_selected }) => {
  const { dollars, cents } = to_dollars_cents(package_data.price_cents);

  return (
    <IonCard
      button
      routerLink={`/new?package_objectId=${package_data.objectId}`}
      routerDirection="back"
      className={`package-card ${is_selected ? "selected" : ""}`}
    >
      {is_selected && (
        <div className="selected-icon">
          <div className="inner">
            <i className="material-icons">done</i>
          </div>
        </div>
      )}
      <article
        className="image"
        style={{ backgroundImage: `url(${package_data.image.url})` }}
      />
      <IonCardHeader className="title">
        <IonCardSubtitle>
          {package_data.amount_of_included_consultations} CONSULTATIONS
        </IonCardSubtitle>
        <IonCardTitle>{package_data.name}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <br />
        {package_data.description}
        <br />
        <strong>{package_data.tagline}</strong>
        <br />
        <br />
        <span className="price">
          $<strong>{dollars}</strong>.<span>{cents}</span>
        </span>
      </IonCardContent>
    </IonCard>
  );
};

export default PackageCard;
