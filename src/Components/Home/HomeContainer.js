import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import PageContainer from "Components/Global/PageContainer";
import RegistrationLogin from "Components/Home/RegistrationLogin";
import "Styles/Home/HomeContainer.scss";

const HomeContainer = () => {
  const { data } = useSelector((state) => state.user);
  const is_user_logged_in = data !== undefined;

  if (is_user_logged_in) {
    return <Redirect to="/projects" />;
  }

  return (
    <PageContainer>
      <RegistrationLogin />
    </PageContainer>
  );
};

export default HomeContainer;
