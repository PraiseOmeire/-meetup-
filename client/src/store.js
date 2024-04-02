import {configureStore} from "@reduxjs/toolkit";
import logger from "redux-logger";
import alertSlice from "./reducers/alert";
import authSlice from "./reducers/auth";

const reducer = {
  alert: alertSlice,
  auth: authSlice,
};

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== "production",
  preloadedState: {},
});
