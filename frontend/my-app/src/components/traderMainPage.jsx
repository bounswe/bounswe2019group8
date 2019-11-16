import React, { Component } from "react";
import "../App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import TraderNavbar from "./traderNavbar";
import axios from "axios";


class TraderMainPage extends Component {
  state = {
    searchClicked: false,
    credentials: {
      userToken: "",
      id: "",
      userEmail: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      userGroup:""

    },
    users: [],
    api: axios.create({
      baseURL: "http://8.209.81.242:8000/"
    })
  };

  render() {
  return(
    <React.Fragment>
    {this.traderNavbar()}  
    </React.Fragment>
  )
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
        var url =
          "http://8.209.81.242:8000/users/" + localStorage.getItem("userId");
        var credentials1 = { ...this.state.credentials };
        var id = localStorage.getItem("userId");
        var token = localStorage.getItem("userToken");
        credentials1.id = id;
        credentials1.userToken = token;
        var userType;
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
    
            var credentials = { ...this.state.credentials };
            credentials.userEmail = res.data.email;
            credentials.firstName = res.data.first_name;
            credentials.lastName = res.data.last_name;
            credentials.dateOfBirth = res.data.date_of_birth;
            credentials.id = id;
            credentials.userToken = token;
            credentials.userGroup = res.data.groups[0];
            this.setState({ credentials: credentials });
          });   
  }
  
  logoutClick = () => {
    localStorage.setItem("userId", null);
    localStorage.setItem("userToken", null);
    localStorage.setItem("userGroup", null);
  };
  traderNavbar = () => {
    return (
      <TraderNavbar
      profileClick={this.profileClick}
      logoutClick={this.logoutClick}
      credentials={this.state.credentials}
      users={this.state.users}
      searchClick={this.searchClick}
      />
    );
  };
}
export default TraderMainPage;
