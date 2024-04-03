import React, {Fragment, useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {selectIsAuthenticated} from "../../reducers/auth";
import "../../App.css";
import {loginUser} from "../../action/auth";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const {email, password} = formData;
  const onChange = (e) =>
    setFormData({...formData, [e.target.name]: e.target.value});

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  console.log("authenticated", isAuthenticated);

  const onSubmit = async (e) => {
    e.preventDefault();
    await dispatch(loginUser(formData));
  };

  //redirect if authenticated
  if (isAuthenticated) {
    console.log("authenticated", isAuthenticated);
    navigate("/dashboard");
  }
  // If isAuthenticated is true, navigate to dashboard

  return (
    <Fragment>
      <div className="container">
        <h1 className="large text-primary">Sign In</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Sign in to Account
        </p>
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
            <small className="form-text">
              This site uses Gravatar so if you want a profile image, use a
              Gravatar email
            </small>
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              minLength="6"
            />
          </div>

          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </Fragment>
  );
};

export default Login;
