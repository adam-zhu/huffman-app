import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IonButton } from "@ionic/react";
import PageContainer from "Components/Global/PageContainer";
import "Styles/Project.scss";
import { get_project } from "Store/project/thinks";
import Messages from "./Messages";

const Project = ({ match }) => {
  const { data } = useSelector((root_state) => root_state.project);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_project(match.params.objectId));
  }, [match.params.objectId]);

  return (
    <PageContainer>
      <IonButton routerLink="/projects" color="secondary">
        <i className="material-icons">chevron_left</i> Back to projects
      </IonButton>
      {data && <Messages />}
    </PageContainer>
  );
};

export default Project;
