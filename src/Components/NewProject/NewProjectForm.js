import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
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
} from "@ionic/react";
import {
  set_form_field_value,
  create_new_project,
} from "Store/new_project/thinks";
import { resolve_input_element_value, cents_to_dollars } from "Utils";

const NewProjectForm = () => {
  const { packages, new_project } = useSelector((state) => state);
  const {
    busy,
    name,
    description,
    room_width,
    room_length,
    room_height,
    package_objectId,
  } = new_project;
  const dispatch = useDispatch();
  const history = useHistory();
  const form_field_change_handler = (key) => (e) => {
    const value = resolve_input_element_value(e.target);

    dispatch(set_form_field_value({ key, value }));
  };
  const submit_handler = (e) => {
    e.preventDefault();

    dispatch(create_new_project(history));
  };

  if (packages.data === undefined) {
    return <IonSkeletonText animated />;
  }

  return (
    <form className="new-project" onSubmit={submit_handler}>
      <IonList>
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

        <IonItem>
          <IonLabel position="stacked">
            Package <IonText color="danger">*</IonText>
          </IonLabel>
          <IonSelect
            value={package_objectId}
            placeholder="Select a package"
            okText="Select package"
            cancelText="Dismiss"
            onIonChange={(e) => {
              const { value } = e.detail;

              console.log({ value });

              dispatch(
                set_form_field_value({ key: "package_objectId", value })
              );
            }}
          >
            {packages.data.map((p) => (
              <IonSelectOption key={p.objectId} value={p.objectId}>
                {p.amount_of_included_consultations} consultations - $
                {cents_to_dollars(p.price_cents)}
              </IonSelectOption>
            ))}
          </IonSelect>
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
  );
};

export default NewProjectForm;
