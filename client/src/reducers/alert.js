import {createSlice} from "@reduxjs/toolkit";

const initialState = [];
let nextId = 0;

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    addAlert: (state, action) => {
      state.push({...action.payload, id: nextId++});
    },
    removeAlert: (state, action) => {
      const alertToRemove = state.find(
        (item) => item.message === action.payload.message
      );
      const newAlert = state.filter((alert) => alert.message !== alertToRemove);
      state.shift();
    },
  },
});

export const {addAlert, removeAlert} = alertSlice.actions;

export default alertSlice.reducer;
