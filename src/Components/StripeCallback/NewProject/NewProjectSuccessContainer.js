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
    if (is_success === true) {
      history.replace(project_url);
    } else {
      dispatch(mark_project_paid(project_objectId)).then(({ is_success }) =>
        set_is_success(is_success)
      );
    }
  }, [is_success, project_objectId, history, dispatch, project_url]);

  return (
    <PageContainer
      id={"stripe-success-new-project"}
      pageContainerClassName="stripe-success-new-project"
    >
      <IonLoading
        cssClass="stripe-redirect-loading"
        isOpen={true}
        message="Payment success! Please wait while we redirect you to your project..."
      />
    </PageContainer>
  );
};

export default NewProjectSuccessContainer;
