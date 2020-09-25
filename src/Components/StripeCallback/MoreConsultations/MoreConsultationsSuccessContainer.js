import React, { useState, useEffect } from "react";
import qs from "query-string";
import { useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import PageContainer from "Components/Global/PageContainer";
import { IonLoading } from "@ionic/react";
import { mark_package_paid } from "Store/new_project/thinks";
import "Styles/StripeCallback/MoreConsultations/MoreConsultationsSuccessContainer.scss";

const MoreConsultationsSuccessContainer = () => {
  const [is_marked_paid, set_is_marked_paid] = useState(null);
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { project_objectId, package_objectId } = qs.parse(location.search);

  useEffect(() => {
    dispatch(mark_package_paid(package_objectId)).then(({ is_success }) => {
      set_is_marked_paid(is_success);

      if (is_success) {
        history.replace(
          `/projects/${project_objectId}?more_consultations=true`
        );
      }
    });
  }, []);

  return (
    <PageContainer
      id={"stripe-success-more-consultations"}
      pageContainerClassName="stripe-success-more-consultations"
    >
      <IonLoading
        cssClass="stripe-redirect-loading"
        isOpen={is_marked_paid === null}
        message="Payment success! Please wait while we configure your project..."
      />
    </PageContainer>
  );
};

export default MoreConsultationsSuccessContainer;
