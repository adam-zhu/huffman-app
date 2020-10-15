import React from "react";
import PageContainer from "Components/Global/PageContainer";
import AddDetailsForm from "Components/AddDetails/AddDetailsForm";
import "Styles/AddDetails/AddDetailsContainer.scss";

const AddDetailsContainer = () => {
  return (
    <PageContainer id="add-details" pageContainerClassName="add-details">
      <AddDetailsForm />
    </PageContainer>
  );
};

export default AddDetailsContainer;
