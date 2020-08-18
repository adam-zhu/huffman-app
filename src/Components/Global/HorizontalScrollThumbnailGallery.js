import React, { useState } from "react";
import { IonCard, IonThumbnail, IonImg } from "@ionic/react";
import Modal from "Components/Global/Modal";
import "Styles/Global/HorizontalThumbnailGallery.scss";

const HorizontalScrollThumbnailGallery = ({ images }) => {
  const [image_modal_src, set_image_modal_src] = useState(null);

  return (
    <>
      {images.length > 0 && (
        <div className="horizontal-thumbnail-gallery">
          <div className="inner">
            {images.map((image_obj, index) => {
              return (
                <IonCard
                  key={index + image_obj.image.url}
                  onClick={() => set_image_modal_src(image_obj.image.url)}
                  className="thumb"
                >
                  <IonThumbnail>
                    <IonImg src={image_obj.image.url} />
                  </IonThumbnail>
                </IonCard>
              );
            })}
          </div>
        </div>
      )}
      {image_modal_src !== null && (
        <Modal
          close_handler={() => set_image_modal_src(null)}
          className="enlarge-image"
        >
          <IonImg className="image" src={image_modal_src} />
        </Modal>
      )}
    </>
  );
};

export default HorizontalScrollThumbnailGallery;
