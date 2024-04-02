import React, {Fragment, useState} from "react";
import {useDispatch} from "react-redux";
import "../../App.css";
import {Link} from "react-router-dom";
import {addAlert, addAlertWithTimeout} from "../../reducers/alert";
import {registerUser} from "../../reducers/auth";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const {name, email, password, password2} = formData;
  const onChange = (e) =>
    setFormData({...formData, [e.target.name]: e.target.value});

  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      dispatch(
        addAlertWithTimeout({type: "danger", message: "Passwords dont match"})
      );
    } else {
      try {
        // Dispatch registerUser thunk
        console.log("formData", formData);
        await dispatch(registerUser(formData));
        // Handle success if needed
      } catch (err) {
        // Handle error
        const errors = err.payload || [{message: "An error occurred"}];
        errors.forEach((error) =>
          dispatch(addAlert({type: "danger", message: error.message}))
        );
      }
    }
  };
  return (
    <Fragment>
      <div className="container">
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Create Your Account
        </p>
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              value={password2}
              onChange={onChange}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </Fragment>
  );
};

export default Register;
