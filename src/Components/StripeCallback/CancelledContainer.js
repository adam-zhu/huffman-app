import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import qs from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import PageContainer from "Components/Global/PageContainer";
import { IonLoading } from "@ionic/react";
import { payment_cancelled } from "Store/new_project/thinks";

const CancelledContainer = () => {
  const { project_cancelled } = useSelector((state) => state.new_project);
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { project_objectId } = qs.parse(location.search);

  useEffect(() => {
    dispatch(payment_cancelled({ project_objectId, history }));
  }, []);

  return (
    <PageContainer className="cancelled-page-container">
      <IonLoading
        isOpen={project_cancelled === undefined}
        message={"Cancelling your order..."}
      />
    </PageContainer>
  );
};

export default CancelledContainer;
