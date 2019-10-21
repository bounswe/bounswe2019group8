import React, { Component } from "react";
import "./App.css";
import Login from "./containers/Login";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Signup from "./containers/Signup";
import TraderNavBar from "./components/traderNavbar";
import ProfilePage from "./components/ProfilePage";
import FollowItem from "./components/FollowItem";
import axios from "axios";

class App extends Component {
  state = {
    isGuest: true,
    isBasic: false,
    isTrader: false,
    loginClicked: false,
    signUpClicked: false,
    profileClicked: false,
    searchClicked: false,
    successfulLogin: false,
    credentials: {
      userToken: "",
      id: "",
      userName: "rick-sanchez",
      userEmail: "rick.sanchez@gmail.com"
    },
    users: [{ id: 1, userName: "Beth" }, { id: 2, userName: "Morty" }],
    api: axios.create({
      baseURL: "http://8.209.81.242:8000/"
    })
  };

  render() {
    if (this.state.credentials.id !== "") {
      var token = this.state.credentials.userToken;
      console.log(this.state.credentials.id);
      console.log("efe");
      var url = "http://8.209.81.242:8000/users/" + this.state.credentials.id;
      console.log(token);

      axios
        .get(url, { headers: { Authentication: `Token ${token}` } })
        .then(res => {
          //console.log(res);
        });
    }
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
            users={this.state.users}
          />
          <Login loginSuccess={this.loginIsSuccessful} api={this.state.api} />
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
            users={this.state.users}
          />
          <Signup api={this.state.api} signUpClicked={this.signUpClick} />
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
            users={this.state.users}
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
            users={this.state.users}
          />
          {this.state.users.map(users => (
            <FollowItem key={users.id} users={users}></FollowItem>
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
            users={this.state.users}
            searchClick={this.searchClick}
          />
          <ProfilePage
            profileClick={this.profileClick}
            credentials={this.state.credentials}
            users={this.state.users}
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
  loginIsSuccessful = (id1, token) => {
    this.setState({ isBasic: true });
    this.setState({ isGuest: false });
    this.setState({ loginClicked: !this.state.loginClicked });
    //console.log(id1);
    var credentials = { ...this.state.credentials };
    credentials.id = id1;
    credentials.userToken = token;
    this.setState({ credentials });
    console.log(this.state.credentials.userToken);
  };
}

export default App;
