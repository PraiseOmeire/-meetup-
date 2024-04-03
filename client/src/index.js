import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import "./App.css";
import App from "./App";
import {BrowserRouter as Router} from "react-router-dom";
import setAuthToken from "./utils/setAuthToken";
import {loadUser} from "./action/auth";

//redux

import {store} from "./store";
import {Provider} from "react-redux";

if (localStorage.token) {
  // setAuthToken(localStorage.token);
}

const Root = () => {
  useEffect(() => {
    // Load user when component mounts
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

// const rootElement = document.getElementById("root");
// const root = ReactDOM.unstable_createRoot(rootElement);
// root.render(<Root />);
