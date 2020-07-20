import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import qs from "query-string";
import PageContainer from "Components/Global/PageContainer";
import "Styles/Packages/PackagesContainer.scss";
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonTitle,
  IonSkeletonText,
  IonThumbnail,
  IonImg,
  IonIcon,
  IonList,
} from "@ionic/react";
import PackageCard from "Components/Packages/PackageCard";
import { load_packages } from "Store/packages/thinks";

const Packages = () => {
  const { packages } = useSelector((state) => state);
  const { data, busy } = packages;
  const dispatch = useDispatch();
  const location = useLocation();
  const { package_objectId } = qs.parse(location.search);

  useEffect(() => {
    if (!data) {
      dispatch(load_packages());
    }
  }, [data]);

  if (!data || busy) {
    return <IonSkeletonText animated />;
  }

  return (
    <PageContainer className="packages-page-container">
      <h1 className="title">
        Select your
        <br />
        package
      </h1>
      <br />
      <div className="scroll">
        {data.map((p) => (
          <PackageCard
            key={p.objectId}
            package_data={p}
            is_selected={package_objectId === p.objectId}
          />
        ))}
      </div>
    </PageContainer>
  );
};

export default Packages;
