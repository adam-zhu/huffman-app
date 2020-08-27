import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import qs from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import { IonContent, IonLoading } from "@ionic/react";
import { new_project_payment_cancelled } from "Store/new_project/thinks";
import { RESET_REDUCER_STATE } from "Store/new_project/reducer";

const NewProjectCancelledContainer = () => {
  const state = useSelector((state) => state);
  const { data_loaded } = state.projects;
  const { project_cancelled } = useSelector((state) => state.new_project);
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { project_objectId } = qs.parse(location.search);

  useEffect(() => {
    if (data_loaded) {
      dispatch(
        new_project_payment_cancelled({ project_objectId, history })
      ).then(() => dispatch({ type: RESET_REDUCER_STATE }));
    }
  }, [data_loaded]);

  return (
    <IonContent
      id="stripe-cancelled-new-project"
      pageContainerClassName="stripe-cancelled-new-project"
    >
      <IonLoading
        isOpen={project_cancelled === undefined}
        message={"Cancelling your order..."}
      />
    </IonContent>
  );
};

export default NewProjectCancelledContainer;
