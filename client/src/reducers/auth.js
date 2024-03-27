import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
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
    registerFail: (state, action) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.token = null;
      state.user = null;
    },
    authError: (state, action) => {
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

export const {registerSucess, registerFail} = authSlice.actions;

export default authSlice.reducer;
