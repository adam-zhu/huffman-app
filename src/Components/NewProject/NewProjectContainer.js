import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import PageContainer from "Components/Global/PageContainer";
import NewProjectForm from "Components/NewProject/NewProjectForm";
import "Styles/NewProject.scss";
import { load_packages } from "Store/packages/thinks";

const NewProject = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(load_packages());
  }, []);

  return (
    <PageContainer className="new-project-page-container">
      <NewProjectForm />
    </PageContainer>
  );
};

export default NewProject;
