import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import PageContainer from "Components/Global/PageContainer";
import RegistrationLogin from "Components/Home/RegistrationLogin";
import "Styles/Home.scss";

const Home = () => {
  const { data } = useSelector((root_state) => root_state.user);
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

export default Home;
