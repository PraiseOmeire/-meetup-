import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {removeAlert} from "../../reducers/alert";

const Alert = () => {
  const dispatch = useDispatch();
  const alert = useSelector((state) => state.alert);

  const handleRemoveAlert = (id) => {
    dispatch(removeAlert(id));
  };
  return (
    <div className="alert-wrapper">
      {alert.length > 0 &&
        alert.map((alert) => (
          <div key={alert.id} className={`alert alert-${alert.type}`}>
            <span>{alert.message}</span>
            <button onClick={() => handleRemoveAlert(alert.id)}>
              &#x2715;
            </button>
          </div>
        ))}
    </div>
  );
};

export default Alert;
