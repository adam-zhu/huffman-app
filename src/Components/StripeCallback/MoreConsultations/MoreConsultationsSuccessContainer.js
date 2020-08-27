import React, { useEffect } from "react";
import qs from "query-string";
import { useLocation, useHistory } from "react-router-dom";
import PageContainer from "Components/Global/PageContainer";
import { IonLoading } from "@ionic/react";
import "Styles/StripeCallback/MoreConsultations/MoreConsultationsSuccessContainer.scss";

const MoreConsultationsSuccessContainer = () => {
  const location = useLocation();
  const { project_objectId } = qs.parse(location.search);
  const history = useHistory();
  const project_url = `/projects/${project_objectId}?more_consultations=true`;
  const redirect = () => history.replace(project_url);
  const wait_duration = 2000;

  useEffect(() => {
    setTimeout(redirect, wait_duration);
  }, []);

  return (
    <PageContainer
      id={"stripe-success-more-consultations"}
      pageContainerClassName="stripe-success-more-consultations"
    >
      <IonLoading
        cssClass="stripe-redirect-loading"
        isOpen={true}
        message="Payment success! Please wait while we configure your project..."
        duration={wait_duration}
      />
    </PageContainer>
  );
};

export default MoreConsultationsSuccessContainer;
