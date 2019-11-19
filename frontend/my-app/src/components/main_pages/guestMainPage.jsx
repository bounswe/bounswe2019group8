import React, { Component } from "react";
import "../../App.css";
import Login from "../../containers/Login";
import Signup from "../../containers/Signup";
import GuestNavbar from "../nav_bars/guestNavbar";
import axios from "axios";
import MainPage from "../mainPage";
import {withRouter} from "react-router-dom";


class GuestMainPage extends Component {
  state = {
    loginClicked: false,
    signUpClicked: false,
    searchClicked: false,
    api: axios.create({
      baseURL: "http://8.209.81.242:8000/"
    })
  };

  render() {
    if (this.state.loginClicked === true) {
      return (
        <React.Fragment>
          {this.guestNavbar()}
          <Login loginSuccess={this.loginIsSuccessful} api={this.state.api} />
        </React.Fragment>
      );
    } else if (this.state.signUpClicked === true) {
      return (
        <React.Fragment>
          {this.guestNavbar()}
          <Signup api={this.state.api} signUpClicked={this.signUpClick} />
        </React.Fragment>
      );
    } 
    else{
        return(
        <React.Fragment>
            {this.guestNavbar()}  
        </React.Fragment>)
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
  loginIsSuccessful = () =>{
    this.props.history.push("/");
  }
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
  //mounting function for local storage
  componentDidMount() {

  }
  guestNavbar = () => {
    return (
      <GuestNavbar
        loginClick={this.loginClick}
        signUpClick={this.signUpClick}
        credentials={this.state.credentials}
        users={this.state.users}
      />
    );
  };
  mainPage = () => {
    return <MainPage />;
  };
}
export default withRouter(GuestMainPage);
