import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import qs from "query-string";
import {
  IonButton,
  IonInput,
  IonTextarea,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
  IonLoading,
} from "@ionic/react";
import { exitOutline } from "ionicons/icons";
import {
  set_form_field_value,
  create_new_project_and_check_out,
} from "Store/new_project/thinks";
import { resolve_input_element_value } from "Utils";
import "Styles/NewProject/NewProjectForm.scss";
import PackagePreviewCard from "Components/Global/PackagePreviewCard";

const NewProjectForm = () => {
  const [is_textarea_focused, set_is_textarea_focused] = useState(false);
  const { products, new_project } = useSelector((state) => state);
  const { busy, name, description } = new_project;
  const location = useLocation();
  const { package_objectId } = qs.parse(location.search);
  const selected_package =
    package_objectId && products.data
      ? products.data.find((p) => p.objectId === package_objectId)
      : undefined;
  const dispatch = useDispatch();
  const form_field_change_handler = (key) => (e) => {
    const value = resolve_input_element_value(e.target);

    dispatch(set_form_field_value({ key, value }));
  };
  const submit_handler = async (e) => {
    e.preventDefault();

    await dispatch(create_new_project_and_check_out({ selected_package }));
  };

  return (
    <div className="new-project-form-container">
      <IonLoading
        isOpen={busy}
        message={
          "Please wait while your project is being created. You will be redirected to checkout momentarily..."
        }
      />
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
          <PackageSelection selected_package={selected_package} />
        </IonList>
        {selected_package && (
          <IonButton
            className="submit-button"
            expand="block"
            type="submit"
            disabled={busy}
          >
            Checkout <IonIcon slot="end" icon={exitOutline}></IonIcon>
          </IonButton>
        )}
      </form>
    </div>
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

const PackageSelection = ({ selected_package }) => {
  return (
    <>
      {!selected_package && (
        <>
          <br />
          <br />
          <IonItem
            className="select-package"
            routerLink={`/packages`}
            button
            color="tertiary"
          >
            <h2>Select a package</h2>
          </IonItem>
        </>
      )}
      {selected_package && (
        <>
          <br />
          <h2>Selected package</h2>
          <IonItem>
            <PackagePreviewCard
              package_data={selected_package}
              routerLink={`/packages?package_objectId=${selected_package.objectId}`}
              button
            />
          </IonItem>
          <IonItem
            routerLink={`/packages?package_objectId=${selected_package.objectId}`}
            button
          >
            Select a different package
          </IonItem>
        </>
      )}
    </>
  );
};

export default NewProjectForm;
