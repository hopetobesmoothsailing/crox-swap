import React from "react";
import useI18n from "hooks/useI18n";
import { useHistory, useParams } from "react-router-dom";

const Ref = () => {
  const params: any = useParams();
  const history = useHistory();

  if (params && params.ref) {
    localStorage.setItem('ref', params.ref);
    history.push('/');
  }

  return (
    <div />
  );
};

export default Ref;
