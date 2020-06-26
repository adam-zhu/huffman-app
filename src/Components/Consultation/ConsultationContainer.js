import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageContainer from "Components/Global/PageContainer";
import "Styles/Consultation.scss";
import { get_consultation } from "Store/consultation/thinks";
import Messages from "./Messages";

const Consultation = ({ match, location }) => {
  const { data } = useSelector((state) => state.consultation);
  const consultation_data = location.state; // gets passed by /project
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_consultation(consultation_data));
  }, [match.params.consultation_objectId]);

  return (
    <PageContainer>
      <h1>{data?.project?.name}</h1>
      {data && <Messages consultation={data} />}
    </PageContainer>
  );
};

export default Consultation;
