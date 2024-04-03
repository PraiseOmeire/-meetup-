import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: false,
  user: null,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = action.payload.token;
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    registerFail: (state, action) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.token = null;
      state.user = 'no user';
    },
    loginFail: (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.token = null;
      state.user = null;
    },
    authError: (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.token = null;
      state.user = null;
    },
    userLoaded: (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
});

export const {
  registerSuccess,
  registerFail,
  loginSuccess,
  loginFail,
  userLoaded,
  authError,
} = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
