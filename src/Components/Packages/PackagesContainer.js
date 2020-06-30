import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageContainer from "Components/Global/PageContainer";

const Packages = () => {
  const { data } = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(get_projects());
  // }, []);

  return (
    <PageContainer className="packagess-page-container">
      <h1>Packages: tbd</h1>
    </PageContainer>
  );
};

export default Packages;
