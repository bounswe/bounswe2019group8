import React, { Component } from "react";
import "./App.css";
import Login from "./containers/Login";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Signup from "./containers/Signup";
import TraderNavBar from "./components/traderNavbar";
import ProfilePage from "./components/ProfilePage";

class App extends Component {
  state = {
    isGuest: false,
    isBasic: false,
    isTrader: true,
    loginClicked: false,
    signUpClicked: false,
    profileClicked: false,
    credentials: {
      userName: "trial-name",
      userEmail: "trial@email.com"
    }
  };
  render() {
    if (
      this.state.loginClicked === true &&
      this.state.signUpClicked === false
    ) {
      return (
        <React.Fragment>
          <TraderNavBar
            loginClick={this.loginClick}
            signUpClick={this.signUpClick}
            isGuest={this.state.isGuest}
            isBasic={this.state.isBasic}
            isTrader={this.state.isTrader}
            credentials={this.state.credentials}
          />
          <Login />
        </React.Fragment>
      );
    } else if (
      this.state.loginClicked === false &&
      this.state.signUpClicked === true
    ) {
      return (
        <React.Fragment>
          <TraderNavBar
            loginClick={this.loginClick}
            signUpClick={this.signUpClick}
            isGuest={this.state.isGuest}
            isBasic={this.state.isBasic}
            isTrader={this.state.isTrader}
            credentials={this.state.credentials}
          />
          <Signup />
        </React.Fragment>
      );
    } else if (
      this.state.loginClicked === false &&
      this.state.signUpClicked === false &&
      this.state.profileClicked === false
    ) {
      return (
        <React.Fragment>
          <TraderNavBar
            loginClick={this.loginClick}
            signUpClick={this.signUpClick}
            profileClick={this.profileClick}
            isGuest={this.state.isGuest}
            isBasic={this.state.isBasic}
            isTrader={this.state.isTrader}
            credentials={this.state.credentials}
          />
        </React.Fragment>
      );
    } else if (
      this.state.loginClicked === false &&
      this.state.signUpClicked === false &&
      this.state.profileClicked === true
    ) {
      return (
        <React.Fragment>
          <TraderNavBar
            loginClick={this.loginClick}
            signUpClick={this.signUpClick}
            profileClick={this.profileClick}
            isGuest={this.state.isGuest}
            isBasic={this.state.isBasic}
            isTrader={this.state.isTrader}
            credentials={this.state.credentials}
          />
          <ProfilePage
            profileClick={this.profileClick}
            credentials={this.state.credentials}
          />
        </React.Fragment>
      );
    }
  }
  loginClick = () => {
    this.setState({ loginClicked: !this.state.loginClicked });
    this.setState({ signUpClicked: false });
  };
  signUpClick = () => {
    this.setState({ loginClicked: false });
    this.setState({ signUpClicked: !this.state.signUpClicked });
  };
  profileClick = () => {
    this.setState({ profileClicked: !this.state.profileClicked });
  };
}

export default App;
