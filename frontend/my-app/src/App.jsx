import React, { Component } from "react";
import "./App.css";
import Login from "./containers/Login";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Signup from "./containers/Signup";
import TraderNavBar from "./components/traderNavbar";
import ProfilePage from "./components/ProfilePage";
import FollowItem from "./components/FollowItem";

class App extends Component {
  state = {
    isGuest: true,
    isBasic: false,
    isTrader: false,
    loginClicked: false,
    signUpClicked: false,
    profileClicked: false,
    searchClicked: false,
    sucessfullLogin:false,
    credentials: {
      userName: "trial-name",
      userEmail: "trial@email.com"
    },
    follows: [{ id: 1, userName: "Ali" }, { id: 2, userName: "Veli" }]
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
            follows={this.state.follows}
          />
          <Login loginSuccess = {this.loginIsSucessfull} />
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
            follows={this.state.follows}
          />
          <Signup />
        </React.Fragment>
      );
    } else if (
      this.state.loginClicked === false &&
      this.state.signUpClicked === false &&
      this.state.profileClicked === false &&
      this.state.searchClicked === false
    ) {
      return (
        <React.Fragment>
          <TraderNavBar
            loginClick={this.loginClick}
            signUpClick={this.signUpClick}
            profileClick={this.profileClick}
            searchClick={this.searchClick}
            isGuest={this.state.isGuest}
            isBasic={this.state.isBasic}
            isTrader={this.state.isTrader}
            credentials={this.state.credentials}
            follows={this.state.follows}
          />
        </React.Fragment>
      );
    } else if (
      this.state.loginClicked === false &&
      this.state.signUpClicked === false &&
      this.state.profileClicked === false &&
      this.state.searchClicked === true
    ) {
      return (
        <React.Fragment>
          <TraderNavBar
            loginClick={this.loginClick}
            signUpClick={this.signUpClick}
            profileClick={this.profileClick}
            searchClick={this.searchClick}
            isGuest={this.state.isGuest}
            isBasic={this.state.isBasic}
            isTrader={this.state.isTrader}
            credentials={this.state.credentials}
            follows={this.state.follows}
          />
          {this.state.follows.map(follows => (
            <FollowItem key={follows.id} follows={follows}></FollowItem>
          ))}
        </React.Fragment>
      );
    } else if (
      this.state.loginClicked === false &&
      this.state.signUpClicked === false &&
      this.state.profileClicked === true &&
      this.state.searchClicked === false
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
            follows={this.state.follows}
            searchClick={this.searchClick}
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
  searchClick = () => {
    this.setState({ searchClicked: !this.state.searchClicked });
  };
  loginIsSucessfull = () => {
    this.setState({ isGuest: false });
    this.setState({ isBasic: true });
    this.setState({ loginClicked: !this.state.loginClicked });
  };
}

export default App;