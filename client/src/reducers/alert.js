import {createSlice} from "@reduxjs/toolkit";

const initialState = [];
let nextId = 0;

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    addAlert: (state, action) => {
      console.log(action.payload, "payload");
      state = state.push({...action.payload, id: nextId++});
      console.log("add Alert state", state);
    },
    removeAlert: (state, action) => {
      console.log("state", state);
      console.log("removedAlert", action);
      const alertToRemove = state.find(
        (item) => item.message === action.payload.message
      );
      console.log("alert removed", alertToRemove);
      const newAlert = state.filter((alert) => alert.message !== alertToRemove);
      console.log("new alert", newAlert);

      state = state.shift();
    },
  },
});

export const {addAlert, removeAlert} = alertSlice.actions;

export default alertSlice.reducer;

export const addAlertWithTimeout =
  (alert, timeout = 5000) =>
  (dispatch) => {
    dispatch(addAlert(alert));
    setTimeout(() => {
      dispatch(removeAlert(alert));
    }, timeout);
  };
