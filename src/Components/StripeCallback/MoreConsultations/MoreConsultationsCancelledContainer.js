import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import qs from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import { IonLoading, IonAlert, IonContent } from "@ionic/react";
import { more_consultations_payment_cancelled } from "Store/more_consultations/thinks";

const MoreConsultationsCancelledContainer = () => {
  const state = useSelector((state) => state);
  const {
    delete_package_request_busy,
    package_deleted,
  } = state.more_consultations;
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { project_objectId, package_objectId } = qs.parse(location.search);

  useEffect(() => {
    if (state.projects.data_loaded) {
      dispatch(
        more_consultations_payment_cancelled({ package_objectId })
      ).then(() =>
        history.replace(
          `/more_consultations/${project_objectId}?cancelled=true`
        )
      );
    }
  }, [state.projects.data_loaded]);

  return (
    <IonContent
      id="stripe-cancelled-more-consuotations"
      pageContainerClassName="stripe-cancelled-more-consultations"
    >
      {package_deleted === undefined && (
        <IonLoading
          isOpen={delete_package_request_busy}
          message={"Cancelling your order..."}
        />
      )}
      {package_deleted === false && (
        <IonAlert
          isOpen={true}
          header="Error"
          subHeader="There was an error cancelling your order."
          message="You were not charged, but your project's data may have been corrupted. If you experience any issues please contact the administrator for help."
          buttons={[
            {
              text: "Okay",
              handler: () => {
                history.replace(`/more_consultations/${project_objectId}`);
              },
            },
          ]}
        />
      )}
    </IonContent>
  );
};

export default MoreConsultationsCancelledContainer;
