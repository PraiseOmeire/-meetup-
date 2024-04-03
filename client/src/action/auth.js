
import setAuthToken from "../utils/setAuthToken";
import axios from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {showAlert} from "./alert";
import {authError, loginSuccess, registerFail, registerSuccess, userLoaded} from "../reducers/auth";

//load user
export const loadUser = () => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get("/api/auth");
        dispatch(userLoaded());
    } catch (err) {
        dispatch(authError());
    }
};

//Register User
export const registerUser = createAsyncThunk(
    " auth/registerUser",
    async (formData, {dispatch, rejectWithValue}) => {
        try {
            const res = await axios.post("/api/users", formData);
            console.log(res, "res");
            dispatch(registerSuccess(res.data));

            dispatch(loadUser());

            localStorage.setItem("token", res.data.token);
            return res.data;
        } catch (err) {
            dispatch(registerFail());
            if (err.response && err.response.data && err.response.data.errors) {
                const errors = err.response.data.errors;
                errors.forEach((error) => {
                    if (error.param === "email") {
                        dispatch(showAlert({type: "danger", message: "Email is invalid"}));
                    } else if (error.param === "password") {
                        dispatch(
                            showAlert({type: "danger", message: "Password is invalid"})
                        );
                    } else {
                        dispatch(showAlert({type: "danger", message: error.msg}));
                    }
                });
            } else {
                dispatch(
                    showAlert({type: "danger", message: "An error occurred"})
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
            dispatch(loginSuccess(res.data));
            dispatch(loadUser());
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                const errors = err.response.data.errors;
                errors.forEach((error) => {
                    if (errors) {
                        dispatch(showAlert({type: "danger", message: error.msg}));
                    }
                });
            } else {
                dispatch(
                    showAlert({type: "danger", message: "An error occurred"})
                );
            }
            return rejectWithValue(err.response?.data);
        }
    }
);
