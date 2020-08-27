import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import qs from "query-string";
import PageContainer from "Components/Global/PageContainer";
import "Styles/Packages/PackagesContainer.scss";
import { IonSkeletonText } from "@ionic/react";
import PackageCard from "Components/Global/PackageCard";
import { load_products } from "Store/products/thinks";

const Packages = () => {
  const { products } = useSelector((state) => state);
  const { data, busy } = products;
  const dispatch = useDispatch();
  const location = useLocation();
  const { package_objectId } = qs.parse(location.search);

  useEffect(() => {
    if (!data) {
      dispatch(load_products());
    }
  }, [data]);

  if (!data || busy) {
    return <IonSkeletonText animated />;
  }

  return (
    <PageContainer id="packages" pageContainerClassName="packages">
      <h1 className="title">
        Select your
        <br />
        package
      </h1>
      <br />
      <div
        className={`scroll ${
          package_objectId && data.find((p) => p.objectId === package_objectId)
            ? "has-selection"
            : ""
        }`}
      >
        {data.map((p) => (
          <PackageCard
            key={p.objectId}
            package_data={p}
            is_selected={package_objectId === p.objectId}
            routerLink={`/new?package_objectId=${p.objectId}`}
            routerDirection="back"
            button
          />
        ))}
      </div>
    </PageContainer>
  );
};

export default Packages;
