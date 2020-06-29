import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageContainer from "Components/Global/PageContainer";
import "Styles/Consultation.scss";
import {
  get_consultation,
  listen_for_consultation_close,
  stop_listening_for_consultation_close,
} from "Store/consultation/thinks";
import Messages from "./Messages";

const Consultation = ({ match }) => {
  const { data } = useSelector((state) => state.consultation);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_consultation(match.params.consultation_objectId));
  }, [match.params.consultation_objectId]);

  useEffect(() => {
    dispatch(listen_for_consultation_close(match.params.consultation_objectId));

    return () => dispatch(stop_listening_for_consultation_close());
  }, [match.params.consultation_objectId]);

  return (
    <PageContainer className="consultation-page-container">
      {data === undefined ? (
        "loading"
      ) : data.is_open === true ? (
        <Messages consultation_objectId={match.params.consultation_objectId} />
      ) : (
        "Consultation has been closed."
      )}
    </PageContainer>
  );
};

export default Consultation;
