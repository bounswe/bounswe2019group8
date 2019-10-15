import React, { Component } from "react";
import "./App.css";
import Login from "./containers/Login";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import NavBar from "./components/navbar";
import Signup from "./containers/Signup";
import TraderNavBar from "./components/traderNavbar";
import BasicNavBar from "./components/basicNavbar";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <Router>
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />

        </Router>
      </React.Fragment>
    );
  }
}

export default App;
