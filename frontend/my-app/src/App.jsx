import React, { Component } from "react";
import "./App.css";
import Login from "./containers/Login";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import NavBar from "./components/navbar";
import Signup from "./containers/Signup";
import TraderNavBar from "./components/traderNavbar";
import BasicNavBar from "./components/basicNavbar";

class App extends Component {
  state = {
    isGuest: false,
    isBasic: false,
    isTrader: true
  };
  render() {
    if (
      this.state.isBasic === false &&
      this.state.isGuest === true &&
      this.state.isTrader === false
    ) {
      return (
        <React.Fragment>
          <NavBar />
          <Router>
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={Signup} />
          </Router>
        </React.Fragment>
      );
    } else if (
      this.state.isBasic === true &&
      this.state.isGuest === false &&
      this.state.isTrader === false
    ) {
      return (
        <React.Fragment>
          <BasicNavBar />
          <Router>
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={Signup} />
          </Router>
        </React.Fragment>
      );
    } else if (
      this.state.isBasic === false &&
      this.state.isGuest === false &&
      this.state.isTrader === true
    ) {
      return (
        <React.Fragment>
          <TraderNavBar />
          <Router>
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={Signup} />
          </Router>
        </React.Fragment>
      );
    }
  }
}

export default App;
