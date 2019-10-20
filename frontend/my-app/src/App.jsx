import React, { Component } from "react";
import "./App.css";
import Login from "./containers/Login";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Signup from "./containers/Signup";
import TraderNavBar from "./components/traderNavbar";
import ProfilePage from "./components/ProfilePage";
import FollowItem from "./components/FollowItem";
import axios from 'axios';

class App extends Component {
  state = {
    isGuest: false,
    isBasic: true,
    isTrader: false,
    loginClicked: false,
    signUpClicked: false,
    profileClicked: false,
    searchClicked: false,
    successfulLogin: false,
    credentials: {
      userName: "rick-sanchez",
      userEmail: "rick.sanchez@gmail.com"
    },
    follows: [{ id: 1, userName: "Beth" }, { id: 2, userName: "Morty" }],
    api : axios.create({
      baseURL: 'http://127.0.0.1:8000/',
    
    })
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
            logoutClick={this.logoutClick}
            signUpClick={this.signUpClick}
            isGuest={this.state.isGuest}
            isBasic={this.state.isBasic}
            isTrader={this.state.isTrader}
            credentials={this.state.credentials}
            follows={this.state.follows}
          />
          <Login loginSuccess={this.loginIsSuccessful} api = {this.state.api}/>
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
            logoutClick={this.logoutClick}
            signUpClick={this.signUpClick}
            isGuest={this.state.isGuest}
            isBasic={this.state.isBasic}
            isTrader={this.state.isTrader}
            credentials={this.state.credentials}
            follows={this.state.follows}
          />
          <Signup  api = {this.state.api} signUpClicked={this.signUpClick}/>
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
            logoutClick={this.logoutClick}
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
            logoutClick={this.logoutClick}
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
            logoutClick={this.logoutClick}
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
            follows={this.state.follows}
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
  logoutClick = () => {
    this.setState({ loginClicked: !this.state.loginClicked });
    this.setState({ signUpClicked: false });
    this.setState({ isTrader: false });
    this.setState({ isGuest: true });
    this.setState({ profileClicked: false });
  };
  profileClick = () => {
    this.setState({ profileClicked: !this.state.profileClicked });
  };
  searchClick = () => {
    this.setState({ searchClicked: !this.state.searchClicked });
  };
  loginIsSuccessful = () => {
    this.setState({ isGuest: false });
    this.setState({ isBasic: true });
    this.setState({ loginClicked: !this.state.loginClicked });
  };
}

export default App;
