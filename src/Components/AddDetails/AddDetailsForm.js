import React, { useState, useRef, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import qs from "query-string";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import {
  IonButton,
  IonInput,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonItemGroup,
  IonThumbnail,
  IonImg,
  IonIcon,
  IonLoading,
  IonToast,
} from "@ionic/react";
import {
  cameraOutline,
  cropOutline,
  eyeOutline,
  imagesOutline,
  sunnyOutline,
} from "ionicons/icons";
import { createGesture } from "@ionic/core";
import { set_form_field_value, save_details } from "Store/add_details/thinks";
import { resolve_input_element_value } from "Utils";
import { usePhotos } from "Hooks";
import "Styles/AddDetails/AddDetailsForm.scss";
import ImagesModalWithGallery from "Components/Global/ImagesModalWithGallery";
import BottomDrawer from "Components/Global/BottomDrawer";

const AddDetailsForm = () => {
  const [
    is_images_upload_modal_open,
    set_is_images_upload_modal_open,
  ] = useState(false);
  const { add_details, projects } = useSelector((state) => state);
  const [is_tooltip_drawer_open, set_is_tooltip_drawer_open] = useState(false);
  const { busy, room_width, room_length, room_height } = add_details;
  const { deletePhoto, photos, takePhoto, getPhotoFromFilesystem } = usePhotos({
    selector: (state) => state.add_details.project_images || [],
    update_handler: (photos) =>
      dispatch(set_form_field_value({ key: "project_images", value: photos })),
    preserve_photo_data_on_unmount: true,
  });
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const { is_new_project } = qs.parse(location.search);
  const { project_objectId } = match.params;
  const project_data = projects.data.find(
    ({ objectId }) => objectId === project_objectId
  );
  const dispatch = useDispatch();
  const form_field_change_handler = (key) => (e) => {
    const value = resolve_input_element_value(e.target);

    dispatch(set_form_field_value({ key, value }));
  };
  const open_images_upload_modal = (e) => {
    e.preventDefault();

    set_is_images_upload_modal_open(true);
  };
  const close_images_upload_modal = (e) => {
    e.preventDefault();

    set_is_images_upload_modal_open(false);
  };
  const submit_handler = async (e) => {
    e.preventDefault();

    await dispatch(save_details(project_objectId));
    photos.forEach(deletePhoto);
    history.push(`/questionnaire/${project_objectId}?is_new_project=true`);
  };
  const drawer_ref = useRef(null);

  useLayoutEffect(() => {
    if (drawer_ref.current) {
      const gesture = createGesture({
        el: drawer_ref.current,
        gestureName: "down-swipe",
        direction: "y",
        onMove: (event) => {
          if (event.deltaY > 20) {
            return set_is_tooltip_drawer_open(false);
          }
        },
      });

      // enable the gesture for the item
      gesture.enable(true);
    }
  }, []);

  return (
    <div className="new-project-form-container">
      {is_new_project && (
        <IonToast
          className="details-toast"
          isOpen={true}
          header="Welcome to your new project!"
          message="Fill in the details below to get started."
          duration={2000}
          position="top"
          buttons={[
            {
              text: "OK",
              role: "cancel",
            },
          ]}
        />
      )}
      <IonLoading
        isOpen={busy}
        message={
          "Please wait while your project details are being saved. You will be redirected momentarily..."
        }
      />
      <form className="new-project" onSubmit={submit_handler}>
        <h1 className="title">Add details to {project_data.name}</h1>
        <IonList lines="none">
          <RoomMeasures
            room_width={room_width}
            room_length={room_length}
            room_height={room_height}
            form_field_change_handler={form_field_change_handler}
          />
          <br />
          <br />
          <PhotosField
            photos={photos}
            tooltip_drawer_open_handler={(e) =>
              set_is_tooltip_drawer_open(true)
            }
            images_upload_modal_open_handler={open_images_upload_modal}
          />
        </IonList>
        <IonButton
          className="submit-button"
          expand="block"
          type="submit"
          disabled={
            busy ||
            photos.length < 1 ||
            !room_width ||
            !room_height ||
            !room_length
          }
        >
          Save
        </IonButton>
      </form>
      {is_images_upload_modal_open && (
        <ImagesModalWithGallery
          photos={photos}
          deletePhoto={deletePhoto}
          takePhoto={takePhoto}
          getPhotoFromFilesystem={getPhotoFromFilesystem}
          close_handler={close_images_upload_modal}
        />
      )}
      <ImageTips
        is_open={is_tooltip_drawer_open}
        close_handler={(e) => set_is_tooltip_drawer_open(false)}
      />
    </div>
  );
};

const RoomMeasures = ({
  room_width,
  room_height,
  room_length,
  form_field_change_handler,
}) => {
  return (
    <>
      <h2>Room measures</h2>
      <IonItemGroup className="measurements">
        <IonItem>
          <IonLabel position="floating">
            Width<IonText color="danger">*</IonText>
          </IonLabel>
          <IonInput
            className="field measurement"
            placeholder="width (inches)"
            type="number"
            inputmode="numeric"
            value={room_width}
            onIonChange={form_field_change_handler("room_width")}
            min={0}
            required
          />
          <span className="units">inches</span>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">
            Length<IonText color="danger">*</IonText>
          </IonLabel>
          <IonInput
            className="field measurement"
            placeholder="length (inches)"
            type="number"
            inputmode="numeric"
            value={room_length}
            onIonChange={form_field_change_handler("room_length")}
            min={0}
            required
          />
          <span className="units">inches</span>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">
            Height<IonText color="danger">*</IonText>
          </IonLabel>
          <IonInput
            className="field measurement"
            placeholder="height (inches)"
            type="number"
            inputmode="numeric"
            value={room_height}
            onIonChange={form_field_change_handler("room_height")}
            min={0}
            required
          />
          <span className="units">inches</span>
        </IonItem>
      </IonItemGroup>
    </>
  );
};

const PhotosField = ({
  photos,
  tooltip_drawer_open_handler,
  images_upload_modal_open_handler,
}) => {
  return (
    <>
      <IonItem className="images-title-item background">
        <h2>
          Upload your pictures<IonText color="danger">*</IonText>
        </h2>
      </IonItem>
      <IonItem className="background tooltip-trigger">
        <span onClick={tooltip_drawer_open_handler}>
          <div className="icon">
            <IonIcon color="primary" icon={cameraOutline} />
          </div>
          See photos best practices
        </span>
      </IonItem>
      <IonItem className="background spacer-item">&nbsp;</IonItem>
      <IonItem
        className="images-item background"
        onClick={images_upload_modal_open_handler}
      >
        <div className="inner">
          <div className="add-button thumb-item">
            <i className="material-icons">add</i>
          </div>
          {photos.map((p, index) => {
            const src = p.base64 ?? p.webPath;

            return (
              <IonThumbnail key={index + src} className="thumb-item">
                <IonImg src={src} className="preview" />
              </IonThumbnail>
            );
          })}
          {[...new Array(photos.length < 3 ? 3 - photos.length : 0).keys()].map(
            () => (
              <div className="blank-photo-slot thumb-item"></div>
            )
          )}
        </div>
      </IonItem>
      <IonItem className="background spacer-item">&nbsp;</IonItem>
      <IonItem className="background spacer-item">&nbsp;</IonItem>
    </>
  );
};

const ImageTips = ({ is_open, close_handler }) => {
  return (
    <BottomDrawer
      className="tooltip-drawer"
      is_open={is_open}
      close_handler={close_handler}
    >
      <br />
      <h3>Take better pictures</h3>
      <br />
      <div className="tips">
        <div className="scroll-container">
          <div className="tip">
            <div className="pic">
              <IonIcon icon={imagesOutline} size="large" />
            </div>
            <br />
            <strong>Upload at minimum 4 photos</strong>
            <p>
              Each picture should be taken from each corner of the room framing
              the floor and ceiling of the opposite corner of the room.
            </p>
          </div>
          <div className="tip alt">
            <div className="pic">
              <IonIcon icon={cropOutline} size="large" />
            </div>
            <br />
            <strong>Fully frame the space</strong>
            <p>
              Each photo needs to include the floor to the ceiling in each
              picture.
            </p>
          </div>
          <div className="tip">
            <div className="pic">
              <IonIcon icon={sunnyOutline} size="large" />
            </div>
            <br />
            <strong>Lighting</strong>
            <p>
              Natural lighting is best but please use flash if needed. The
              brighter the picture the better.
            </p>
          </div>
          <div className="tip alt">
            <div className="pic">
              <IonIcon icon={eyeOutline} size="large" />
            </div>
            <br />
            <strong>Perspective</strong>
            <p>
              Please keep the camera at a flat (straight up and down) angle to
              the image. This helps give me a better perspective of the space.
            </p>
          </div>
        </div>
      </div>
    </BottomDrawer>
  );
};

export default AddDetailsForm;
