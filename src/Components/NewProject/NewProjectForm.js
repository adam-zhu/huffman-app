import React, { useState, useRef, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import qs from "query-string";
import {
  IonButton,
  IonInput,
  IonTextarea,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonItemGroup,
  IonThumbnail,
  IonImg,
  IonIcon,
} from "@ionic/react";
import { cameraOutline, exitOutline } from "ionicons/icons";
import { createGesture } from "@ionic/core";
import {
  set_form_field_value,
  create_new_project_and_check_out,
} from "Store/new_project/thinks";
import { resolve_input_element_value } from "Utils";
import { usePhotos } from "Hooks";
import "Styles/NewProject/NewProjectForm.scss";
import ImagesModalWithGallery from "Components/Global/ImagesModalWithGallery";
import BottomDrawer from "Components/Global/BottomDrawer";
import PackagePreviewCard from "Components/Global/PackagePreviewCard";

const NewProjectForm = () => {
  const [
    is_images_upload_modal_open,
    set_is_images_upload_modal_open,
  ] = useState(false);
  const [is_textarea_focused, set_is_textarea_focused] = useState(false);
  const { packages, new_project, App } = useSelector((state) => state);
  const { ion_content_ref } = App;
  const [is_tooltip_drawer_open, set_is_tooltip_drawer_open] = useState(false);
  const {
    busy,
    name,
    description,
    room_width,
    room_length,
    room_height,
  } = new_project;
  const location = useLocation();
  const { package_objectId } = qs.parse(location.search);
  const selected_package =
    package_objectId && packages.data
      ? packages.data.find((p) => p.objectId === package_objectId)
      : undefined;
  const { deletePhoto, photos, takePhoto, getPhotoFromFilesystem } = usePhotos({
    selector: (state) => state.new_project.project_images || [],
    update_handler: (photos) =>
      dispatch(set_form_field_value({ key: "project_images", value: photos })),
    preserve_photo_data_on_unmount: true,
  });
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

    await dispatch(create_new_project_and_check_out({ selected_package }));
    photos.forEach(deletePhoto);
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
  useLayoutEffect(() => {
    const should_scroll =
      !is_images_upload_modal_open &&
      (selected_package !== undefined || photos.length !== 0);

    if (should_scroll && ion_content_ref && ion_content_ref.current) {
      ion_content_ref.current.getScrollElement().then((scroll_element) => {
        window.requestAnimationFrame(() => {
          scroll_element.scrollTop = scroll_element.scrollHeight;
        });
      });
    }
  }, [
    !is_images_upload_modal_open,
    selected_package?.objectId,
    photos.length !== 0,
    ion_content_ref,
  ]);

  return (
    <>
      <form className="new-project" onSubmit={submit_handler}>
        <h1 className="title">Create a new project</h1>
        <IonList lines="none">
          <NameDescription
            name={name}
            description={description}
            form_field_change_handler={form_field_change_handler}
            is_textarea_focused={is_textarea_focused}
            set_is_textarea_focused={set_is_textarea_focused}
          />
          <br />
          <RoomMeasures
            room_width={room_width}
            room_length={room_length}
            room_height={room_height}
            form_field_change_handler={form_field_change_handler}
          />
          <br />
          <PhotosField
            photos={photos}
            tooltip_drawer_open_handler={(e) =>
              set_is_tooltip_drawer_open(true)
            }
            images_upload_modal_open_handler={open_images_upload_modal}
          />
          <IonItem className="background spacer-item">&nbsp;</IonItem>
          <IonItem className="background spacer-item">&nbsp;</IonItem>
          <PackageSelection
            photos={photos}
            selected_package={selected_package}
          />
        </IonList>
        {selected_package && (
          <IonButton className="submit-button" expand="block" type="submit">
            Checkout <IonIcon slot="end" icon={exitOutline}></IonIcon>
          </IonButton>
        )}
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
    </>
  );
};

const NameDescription = ({
  name,
  description,
  form_field_change_handler,
  is_textarea_focused,
  set_is_textarea_focused,
}) => {
  return (
    <>
      <IonItem>
        <IonLabel position="floating">
          Name<IonText color="danger">*</IonText>
        </IonLabel>
        <IonInput
          className="field"
          placeholder="Name your project"
          type="text"
          value={name}
          onIonChange={form_field_change_handler("name")}
          required
          autofocus
        />
      </IonItem>
      <br />
      <IonItem>
        <IonLabel position="floating">
          Description<IonText color="danger">*</IonText>
        </IonLabel>
        <IonTextarea
          className={`field ${is_textarea_focused ? "has-focus" : ""}`}
          placeholder="What is your design goal?"
          value={description}
          onIonChange={form_field_change_handler("description")}
          onFocus={() => set_is_textarea_focused(true)}
          onBlur={() => set_is_textarea_focused(false)}
          required
        />
      </IonItem>
    </>
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
        <h2>Upload your pictures</h2>
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
    </>
  );
};

const PackageSelection = ({ photos, selected_package }) => {
  return (
    <>
      {photos.length === 0 && !selected_package && (
        <>
          <IonItem className="background spacer-item">&nbsp;</IonItem>
          <IonItem className="background spacer-item">&nbsp;</IonItem>
          <IonItem className="background spacer-item">&nbsp;</IonItem>
        </>
      )}
      {photos.length > 0 && !selected_package && (
        <IonItem className="select-package" routerLink={`/packages`} button>
          <h2>Select a package</h2>
        </IonItem>
      )}
      {selected_package && (
        <>
          <br />
          <h2>Selected package</h2>
          <IonItem>
            <PackagePreviewCard package_data={selected_package} />
          </IonItem>
        </>
      )}
    </>
  );
};

const ImageTips = ({ is_open, close_handler }) => {
  return (
    <BottomDrawer
      cssClass="tooltip-drawer"
      is_open={is_open}
      close_handler={close_handler}
    >
      <br />
      <h3>Take better pictures</h3>
      <br />
      <div className="tips">
        <div className="scroll-container">
          <div className="tip">
            <div className="pic" />
            <br />
            <strong>Frame the entire space</strong>
            <p>
              First of all, in photography, there are no rules, just guidelines
              that you can follow until you discover your style. I love bright
              and airy shots; others prefer dark and moody. But when you use my
              tips, you will have a good start in interior photography.
            </p>
          </div>
          <div className="tip alt">
            <div className="pic" />
            <br />
            <strong>Use natural light whenever possible!</strong>
            <p>
              So turn all the lights off. I repeat OFF! Light bulbs cause
              terrible shadows and color casts. As human beings, we are very
              capable of interpreting the yellow color cast of incandescent
              bulbs or the dull green of fluorescent lights as white light, but
              the camera is a different story.
            </p>
          </div>
          <div className="tip">
            <div className="pic" />
            <br />
            <strong>Use a tripod</strong>
            <p>
              The light conditions are rarely good enough to shoot handheld
              indoors. So a tripod is a must! I prefer to keep my aperture
              between F/9 and F/11 and my ISO as low as possible (100 yes!) to
              create an overall sharp image. And with your camera mounted on a
              tripod, the shutter speed is no longer an issue.
            </p>
          </div>
          <div className="tip alt">
            <div className="pic" />
            <br />
            <strong>Keep your lines straight</strong>
            <p>
              Keep your verticals vertical and, when shooting a one-point
              perspective, your horizontals horizontal too! Our brain is capable
              of realizing that doors are vertical even if we see them from an
              angled view, but the camera is not.
            </p>
          </div>
          <div className="tip">
            <div className="pic" />
            <br />
            <strong>Overcast days are the best</strong>
            <p>
              Every house in its surroundings looks better when the sun is
              shining, and the sky is blue. But the sunlight creates a very
              sharp difference between lights and darks indoors especially when
              it is shining straight through the windows.
            </p>
          </div>
          <div className="tip alt">
            <div className="pic" />
            <br />
            <strong>Create space</strong>
            <p>
              The hardest part of interior photography (besides the light) is
              the lack of space. So don’t be afraid to move furniture when it is
              standing in the way of creating a beautiful shot. Or shoot from
              the hallway into the room at the point where you won’t see the
              doorposts in the viewfinder anymore.
            </p>
          </div>
        </div>
      </div>
    </BottomDrawer>
  );
};

export default NewProjectForm;
