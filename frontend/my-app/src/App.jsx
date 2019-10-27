import React, { Component } from "react";
import "./App.css";
import Login from "./containers/Login";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Signup from "./containers/Signup";
import TraderNavBar from "./components/traderNavbar";
import ProfilePage from "./components/ProfilePage";
/*import FollowItem from "./components/FollowItem";*/
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
      userEmail: "",
      firstName: "",
      lastName: "",
      dateOfBirth: ""
    },
    users: [],
    api: axios.create({
      baseURL: "http://8.209.81.242:8000/"
    })
  };

  render() {
    //console.log(localStorage.credentials.id);
    //this.componentDidMount();
    if (this.state.credentials.id !== "") {
      var token = this.state.credentials.userToken;
      var url = "http://8.209.81.242:8000/users/" + this.state.credentials.id;

      axios
        .get("http://8.209.81.242:8000/users", {
          headers: { Authorization: `Token ${token}` }
        })
        .then(res => {
          this.setState({ users: res.data });
        });
      axios
        .get(url, { headers: { Authorization: `Token ${token}` } })
        .then(res => {
          this.state.credentials.userEmail = res.data.email;
          this.state.credentials.firstName = res.data.first_name;
          this.state.credentials.lastName = res.data.last_name;
          this.state.credentials.dateOfBirth = res.data.date_of_birth;
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
            api={this.state.api}
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
    this.setState({ isBasic: false });
    this.setState({ isGuest: true });
    this.setState({ profileClicked: false });
    localStorage.setItem("userId", null);
    localStorage.setItem("userToken", null);
  };
  profileClick = () => {
    this.setState({ profileClicked: !this.state.profileClicked });
  };
  searchClick = () => {
    this.setState({ searchClicked: !this.state.searchClicked });
    axios
      .get("http://8.209.81.242:8000/users/", {
        headers: { Authorization: `Token ${this.state.credentials.userToken}` }
      })
      .then(userList => {
        this.state.users = userList;
      });
  };
  loginIsSuccessful = (id1, token) => {
    this.setState({ isBasic: true });
    this.setState({ isGuest: false });
    this.setState({ loginClicked: !this.state.loginClicked });
    var credentials = { ...this.state.credentials };
    credentials.id = id1;
    credentials.userToken = token;
    this.setState({ credentials });
    localStorage.setItem("userToken", credentials.userToken);
    localStorage.setItem("userId", credentials.id);
    //console.log(localStorage.getItem(""));
  };

  //mounting function for local storage

  componentDidMount() {
    //console.log("efe");
    if (localStorage.getItem("userId") !== null) {
      var url =
        "http://8.209.81.242:8000/users/" + localStorage.getItem("userId");
      var credentials1 = { ...this.state.credentials };
      var id = localStorage.getItem("userId");
      var token = localStorage.getItem("userToken");
      credentials1.id = id;
      credentials1.userToken = token;
      this.setState({ isTrader: true, isGuest: false });
      var userType;

      axios
        .get(url, { headers: { Authorization: `Token ${token}` } })
        .then(res => {
          userType = res.data.groups;
          console.log(userType);
          credentials1.firstName = res.data.first_name;
          credentials1.lastName = res.data.last_name;
          this.setState({ credentials: credentials1 });
        });

      //const profileClicked = localStorage.getItem("profileClicked");
      //console.log(credentials1.id);
      this.setState({
        //credentials: credentials1
        //loginClicked: loginClicked
        //signUpClicked,
        //profileClicked
      });
    }
  }
}

export default App;
