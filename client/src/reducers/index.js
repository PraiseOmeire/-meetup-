import {combineReducers} from "@reduxjs/toolkit";
import {alertSlice} from "./alert";
import {authSlice} from "./auth";

export default combineReducers({
  //   alert: alertSlice.reducer,
  auth: authSlice.reducer,
});
