import React, { useState } from "react";
import { IonGrid, IonRow, IonThumbnail, IonImg, IonCard } from "@ionic/react";
import Modal from "Components/Global/Modal";
import "Styles/Global/ThumbnailGallery.scss";

const ThumbnailGallery = ({ images }) => {
  const [image_modal_src, set_image_modal_src] = useState(null);

  return (
    <IonGrid className="thumbnail-gallery">
      {images.length > 0 && (
        <IonRow className="images">
          <div className="inner">
            {images.map((image_obj, index) => {
              return (
                <IonCard
                  className="thumb"
                  key={index + image_obj.image.url}
                  onClick={() => set_image_modal_src(image_obj.image.url)}
                >
                  <IonThumbnail>
                    <IonImg src={image_obj.image.url} />
                  </IonThumbnail>
                </IonCard>
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
    </IonGrid>
  );
};

export default ThumbnailGallery;
