import React from "react";
import qs from "query-string";
import { useLocation } from "react-router-dom";
import { IonToast } from "@ionic/react";
import PageContainer from "Components/Global/PageContainer";
import NewProjectForm from "Components/NewProject/NewProjectForm";
import "Styles/NewProject/NewProjectContainer.scss";

const NewProjectContainer = () => {
  const location = useLocation();
  const { cancelled } = qs.parse(location.search);

  return (
    <PageContainer id="new-project" pageContainerClassName="new-project">
      <NewProjectForm />
      {cancelled && (
        <IonToast
          isOpen={true}
          header="Project cancelled"
          message="Your project was successfully cancelled."
          duration={3000}
          position="top"
          translucent
          buttons={[
            {
              text: "OK",
              role: "cancel",
            },
          ]}
        />
      )}
    </PageContainer>
  );
};

export default NewProjectContainer;
