import React from "react";
import PageContainer from "Components/Global/PageContainer";
import NewProjectForm from "Components/NewProject/NewProjectForm";
import "Styles/NewProject/NewProjectContainer.scss";

const NewProjectContainer = () => {
  return (
    <PageContainer className="new-project-page-container">
      <NewProjectForm />
    </PageContainer>
  );
};

export default NewProjectContainer;
