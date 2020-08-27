import React from "react";
import "Styles/Global/PackageCard.scss";
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
} from "@ionic/react";
import { to_dollars_cents } from "Utils";

const PackageCard = ({ package_data, is_selected, ...rest }) => {
  const { dollars, cents } = to_dollars_cents(package_data.price_cents);

  return (
    <IonCard
      className={`package-card ${is_selected ? "selected" : ""}`}
      {...rest}
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
        <IonCardSubtitle className="title-consultation-count">
          {package_data.included_consultations_count} CONSULTATIONS
        </IonCardSubtitle>
        <IonCardTitle>{package_data.name}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p className="description">{package_data.description}</p>
        <span className="price">
          $<strong>{dollars}</strong>.<span>{cents}</span>
        </span>
        <strong className="consultation-count">
          {package_data.included_consultations_count} consultation
          {package_data.included_consultations_count > 1 ? "s" : ""}
        </strong>
      </IonCardContent>
    </IonCard>
  );
};

export default PackageCard;
