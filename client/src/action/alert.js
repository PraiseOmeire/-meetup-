import {addAlert, removeAlert} from "../reducers/alert";

export const showAlert =
    (alert, timeout = 5000) =>
        (dispatch) => {
            dispatch(addAlert(alert));
            setTimeout(() => {
                dispatch(removeAlert(alert));
            }, timeout);
        };
