import React, { useState } from "react";
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
  IonSelect,
  IonSelectOption,
  IonSkeletonText,
  IonThumbnail,
  IonIcon,
  IonImg,
} from "@ionic/react";
import { camera } from "ionicons/icons";
import {
  set_form_field_value,
  create_new_project,
} from "Store/new_project/thinks";
import { resolve_input_element_value } from "Utils";
import { usePhotos } from "Hooks";
import ImagesModal from "Components/Global/ImagesModal";
import PackagePreviewCard from "Components/Packages/PackagePreviewCard";

const NewProjectForm = () => {
  const [
    is_images_upload_modal_open,
    set_is_images_upload_modal_open,
  ] = useState(false);
  const { packages, new_project } = useSelector((state) => state);
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
  });
  const dispatch = useDispatch();
  const history = useHistory();
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

    await dispatch(create_new_project({ package_objectId, history }));
    photos.forEach(deletePhoto);
  };

  if (packages.data === undefined) {
    return <IonSkeletonText animated />;
  }

  return (
    <>
      <form className="new-project" onSubmit={submit_handler}>
        <IonList lines="none">
          <IonItem>
            <IonLabel position="floating">
              Name <IonText color="danger">*</IonText>
            </IonLabel>
            <IonInput
              cssClass="field"
              placeholder="the name of your project"
              type="text"
              value={name}
              onIonChange={form_field_change_handler("name")}
              disabled={busy}
              required
              autofocus
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">
              Description <IonText color="danger">*</IonText>
            </IonLabel>
            <IonTextarea
              cssClass="field"
              placeholder="a brief description of your project"
              value={description}
              onIonChange={form_field_change_handler("description")}
              disabled={busy}
              required
            />
          </IonItem>

          <IonItemGroup>
            <IonItem>
              <IonLabel position="floating">
                Room width (inches) <IonText color="danger">*</IonText>
              </IonLabel>
              <IonInput
                cssClass="field"
                placeholder="width (inches)"
                type="number"
                inputmode="numeric"
                value={room_width}
                onIonChange={form_field_change_handler("room_width")}
                disabled={busy}
                min={0}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">
                Room length (inches) <IonText color="danger">*</IonText>
              </IonLabel>
              <IonInput
                cssClass="field"
                placeholder="length (inches)"
                type="number"
                inputmode="numeric"
                value={room_length}
                onIonChange={form_field_change_handler("room_length")}
                disabled={busy}
                min={0}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">
                Room height (inches) <IonText color="danger">*</IonText>
              </IonLabel>
              <IonInput
                cssClass="field"
                placeholder="height (inches)"
                type="number"
                inputmode="numeric"
                value={room_height}
                onIonChange={form_field_change_handler("room_height")}
                disabled={busy}
                min={0}
                required
              />
            </IonItem>
          </IonItemGroup>

          <IonItem onClick={open_images_upload_modal}>
            <IonLabel position="stacked">
              Images <IonText color="danger">*</IonText>
            </IonLabel>
            {photos.length > 0 ? (
              <div className="images-uploaded">
                <div className="images">
                  {photos.map((p, index) => {
                    const src = p.base64 ?? p.webPath;

                    return (
                      <IonThumbnail key={index + src}>
                        <IonImg src={src} className="preview" />
                      </IonThumbnail>
                    );
                  })}
                </div>
                <IonButton
                  type="button"
                  expand="block"
                  color="dark"
                  fill="outline"
                  className="images-button"
                >
                  <IonIcon icon={camera} slot="start"></IonIcon>Edit Images
                </IonButton>
              </div>
            ) : (
              <IonButton
                type="button"
                expand="block"
                color="dark"
                fill="outline"
                className="images-button"
              >
                <IonIcon icon={camera} slot="start"></IonIcon>Add Images
              </IonButton>
            )}
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">
              Package <IonText color="danger">*</IonText>
            </IonLabel>
            {selected_package ? (
              <PackagePreviewCard package_data={selected_package} />
            ) : (
              <IonButton
                type="button"
                expand="block"
                color="dark"
                fill="outline"
                className="packages-button"
                routerLink={
                  package_objectId
                    ? `/packages?package_objectId=${package_objectId}`
                    : `/packages`
                }
              >
                Select a package
              </IonButton>
            )}
          </IonItem>
        </IonList>
        <IonButton
          className="submit-button"
          expand="block"
          disabled={busy}
          type="submit"
        >
          Create Project &rarr;
        </IonButton>
      </form>
      {is_images_upload_modal_open && (
        <ImagesModal
          photos={photos}
          deletePhoto={deletePhoto}
          takePhoto={takePhoto}
          getPhotoFromFilesystem={getPhotoFromFilesystem}
          close_handler={close_images_upload_modal}
        />
      )}
    </>
  );
};

export default NewProjectForm;
