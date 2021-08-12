import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  // MemoryRouter as Router,
  Switch, Route, Redirect
} from "react-router-dom";
import LandingPage from './Pages/Home/LandingPage';
import Login from './Pages/Login/Login';
import Register from './Pages/Login/Register';
import { AuthContext } from './Context/AuthContext';
import Interceptor from "./api/axios";
// import "bootstrap/dist/css/bootstrap.min.css";
import Contactus from './FaizComponent/Contactus';

function App() {
  const { state, dispatch } = useContext(AuthContext);
  useEffect(() => {
    Interceptor.interceptor(dispatch);
  }, [])

  const user = state.auth?.user;
  console.log(user)
  return (
    <div className="App">
      < Router >
        <Switch>
          {/* <Route exact path="/admin/login">  {user ? <Redirect to="dashboard" /> : <Login />}</Route> */}
          <Route path="/"> <LandingPage /></Route>
          {/* <Route exact path="/dashboard"> {user ? <LandingPage /> : <Login />}</Route> */}
          {/* <Route path="/register">{user ? <Redirect to="/" /> : <Register />}</Route> */}
          {/* <Route path="/messenger/"> {!user ? <Redirect to="/" /> : <LandingPage />}</Route> */}
          {/* <Route path="/*"><Contactus /></Route> */}
        </Switch>
      </Router >
    </div>
  );
}

export default App;
