import {createSelector, createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {addAlert, addAlertWithTimeout} from "./alert";
import setAuthToken from "../utils/setAuthToken";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

//load user
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get("/api/auth");
    dispatch({
      type: "userLoaded",
      payload: res.data,
    });
  } catch (err) {
    console.log("error", err);
    dispatch({type: "authError"});
  }
};

//Register User
export const registerUser = createAsyncThunk(
  " auth/registerUser",
  async (formData, {dispatch, rejectWithValue}) => {
    try {
      const res = await axios.post("/api/users", formData);
      console.log(formData, "formData");
      console.log(res, "res");
      dispatch({type: "registerSucess", payload: res.data});

      dispatch(loadUser());

      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (err) {
      console.log(err, "error");

      if (err.response && err.response.data && err.response.data.errors) {
        const errors = err.response.data.errors;
        errors.forEach((error) => {
          if (error.param === "email") {
            dispatch(addAlert({type: "danger", message: "Email is invalid"}));
          } else if (error.param === "password") {
            dispatch(
              addAlert({type: "danger", message: "Password is invalid"})
            );
          } else {
            dispatch(addAlert({type: "danger", message: error.msg}));
          }
        });
      } else {
        dispatch(
          addAlertWithTimeout({type: "danger", message: "An error occurred"})
        );
      }
      return rejectWithValue(err.response?.data);
    }
  }
);

//login user
export const loginUser = createAsyncThunk(
  " auth/loginUser",
  async (formData, {dispatch, rejectWithValue}) => {
    try {
      const res = await axios.post("/api/auth", formData);
      dispatch({type: "loginSuccess", payload: res.data});
      dispatch(loginSuccess({}));

      // dispatch(loadUser());

      // localStorage.setItem("token", res.data.token);
      // return res.data;
    } catch (err) {
      console.log(err, "error");

      if (err.response && err.response.data && err.response.data.errors) {
        const errors = err.response.data.errors;
        errors.forEach((error) => {
          if (errors) {
            dispatch(addAlert({type: "danger", message: error.msg}));
          }
        });
      } else {
        dispatch(
          addAlertWithTimeout({type: "danger", message: "An error occurred"})
        );
      }
      return rejectWithValue(err.response?.data);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerSucess: (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    loginSuccess: (state, action) => {
      console.log("state", state, action);

      state.isAuthenticated = action.payload.token;
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    registerFail: (state, action) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.token = null;
      state.user = null;
    },
    loginFail: (state, action) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.token = null;
      state.user = null;
    },
    authError: (state, action) => {
      Object.assign(state, {
        isAuthenticated: true,
        loading: false,
        token: null,
        user: null,
      });
    },
    userLoaded: (state, action) => {
      console.log("userloaded");
      state.isAuthenticated = true;
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
});

export const {
  registerSucess,
  registerFail,
  loginSuccess,
  loginFail,
  userLoaded,
} = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
