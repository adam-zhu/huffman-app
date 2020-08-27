import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch, useLocation } from "react-router-dom";
import qs from "query-string";
import PageContainer from "Components/Global/PageContainer";
import "Styles/MoreConsultations/MoreConsultationsContainer.scss";
import { IonSkeletonText, IonButton, IonIcon, IonToast } from "@ionic/react";
import { exitOutline } from "ionicons/icons";
import PackageCard from "Components/Global/PackageCard";
import PackagePreviewCard from "Components/Global/PackagePreviewCard";
import BottomDrawer from "Components/Global/BottomDrawer";
import { select_project_data } from "Store/projects/selectors";
import { load_products } from "Store/products/thinks";
import { create_and_attach_package } from "Store/more_consultations/thinks";

const MoreConsultations = () => {
  const [selected_package, set_selected_package] = useState(null);
  const state = useSelector((state) => state);
  const { data, busy } = state.products;
  const match = useRouteMatch();
  const project_data = select_project_data({ state, match });
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { cancelled } = qs.parse(search);

  useEffect(() => {
    if (!data) {
      dispatch(load_products());
    }
  }, [data]);

  if (!data || busy) {
    return <IonSkeletonText animated />;
  }

  return (
    <PageContainer
      id="more-consultations"
      pageContainerClassName="more-consultations"
    >
      <h1 className="title">
        Add more
        <br />
        consultations
      </h1>
      <div className={`scroll ${selected_package ? "has-selection" : ""}`}>
        {data.map((p) => (
          <PackageCard
            key={p.objectId}
            package_data={p}
            is_selected={
              selected_package && p.objectId === selected_package.objectId
            }
            onClick={(e) =>
              set_selected_package(
                selected_package && p.objectId === selected_package.objectId
                  ? null
                  : p
              )
            }
            button
          />
        ))}
      </div>
      <SelectedPackage
        project_data={project_data}
        selected_package={selected_package}
        set_selected_package={set_selected_package}
      />
      {cancelled && (
        <IonToast
          className="more-consultations-cancelled-toast"
          isOpen={true}
          header="Order cancelled"
          message="Order successfully cancelled."
          duration={4000}
          position="top"
          buttons={[
            {
              text: "OK",
              role: "cancel",
            },
          ]}
        />
      )}
    </PageContainer>
  );
};

const SelectedPackage = ({
  project_data,
  selected_package,
  set_selected_package,
}) => {
  const dispatch = useDispatch();
  const checkout_handler = (e) => {
    e.preventDefault();

    dispatch(create_and_attach_package({ selected_package, project_data }));
  };

  return (
    <div className="selected-package">
      {selected_package === null && (
        <p>Select a package to add more consultations.</p>
      )}
      <BottomDrawer
        is_open={selected_package !== null}
        close_handler={(e) => set_selected_package(null)}
      >
        <div className="container">
          {selected_package && (
            <PackagePreviewCard package_data={selected_package} />
          )}
          <form onSubmit={checkout_handler}>
            <IonButton expand="block" color="primary" type="submit">
              Checkout <IonIcon slot="end" icon={exitOutline}></IonIcon>
            </IonButton>
          </form>
        </div>
      </BottomDrawer>
    </div>
  );
};

export default MoreConsultations;
