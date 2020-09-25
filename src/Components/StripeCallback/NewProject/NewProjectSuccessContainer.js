import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import qs from "query-string";
import { useLocation, useHistory } from "react-router-dom";
import PageContainer from "Components/Global/PageContainer";
import { IonLoading } from "@ionic/react";
import "Styles/StripeCallback/NewProject/NewProjectSuccessContainer.scss";
import { mark_project_paid } from "Store/new_project/thinks";

const NewProjectSuccessContainer = () => {
  const [is_success, set_is_success] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const { project_objectId } = qs.parse(location.search);
  const history = useHistory();
  const project_url = `/questionnaire/${project_objectId}?new_project=true`;

  useEffect(() => {
    dispatch(mark_project_paid(project_objectId)).then((result) => {
      set_is_success(result.is_success);
      if (result.is_success) {
        history.replace(project_url);
      }
    });
  }, []);

  return (
    <PageContainer
      id={"stripe-success-new-project"}
      pageContainerClassName="stripe-success-new-project"
    >
      <IonLoading
        cssClass="stripe-redirect-loading"
        isOpen={is_success === null}
        message="Payment success! Please wait while we redirect you to your project..."
      />
    </PageContainer>
  );
};

export default NewProjectSuccessContainer;
