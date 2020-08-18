import React, { useEffect } from "react";
import qs from "query-string";
import { useLocation, useHistory } from "react-router-dom";
import PageContainer from "Components/Global/PageContainer";
import { IonLoading } from "@ionic/react";
import "Styles/StripeCallback/SuccessContainer.scss";

const SuccessContainer = () => {
  const location = useLocation();
  const { project_objectId } = qs.parse(location.search);
  const history = useHistory();
  const project_url = `/questionnaire/${project_objectId}?new_project=true`;
  const redirect_to_questionnaire = () => history.replace(project_url);
  const wait_duration = 3000;

  useEffect(() => {
    setTimeout(redirect_to_questionnaire, wait_duration);
  }, []);

  return (
    <PageContainer>
      <IonLoading
        cssClass="stripe-redirect-loading"
        isOpen={true}
        message="Payment success! Please wait while we create your project..."
        duration={wait_duration}
      />
    </PageContainer>
  );
};

export default SuccessContainer;
