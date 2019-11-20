import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./traderNavbar.css";
import {
  Button,
  Form,
  Navbar,
  Nav,
  NavDropdown,
  FormControl
} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import axios from "axios";

class TraderNavbar extends Component {
  state = {credentials:{}};

  render() {
      return (
        <Navbar bg="dark" expand="lg">
          <Navbar.Brand href="#" className="navBarSyles">
            <img
              src={require("../images/MERCATUS-LOGO72DP.png")}
              height="50"
              weight="70"
              alt="mercatus"
            />
          </Navbar.Brand>
          <Navbar.Toggle
            class="navbar-toggler"
            aria-controls="basic-navbar-nav"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#">Trading Equipment</Nav.Link>
              <Nav.Link href="#">Events</Nav.Link>
              <Nav.Link href="#">Articles</Nav.Link>
            </Nav>
            <Form inline>
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
            <NavDropdown
              title={
                this.state.credentials.firstName +
                " " +
                this.state.credentials.lastName
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item
                href="#"
                onClick={() => this.profileClick()}
              >
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item href="#">Settings</NavDropdown.Item>
              <NavDropdown.Item href="#">Portfolio</NavDropdown.Item>

              <NavDropdown.Divider />
              <Button
                id="loginStyles"
                onClick={() => this.logoutClick()}
                variant="outline-danger"
                size="sm"
              >
                Logout
              </Button>
            </NavDropdown>
            <img
              className="rounded-circle"
              src={require("../images/rick.jpg")}
              size="sm"
              alt="10x10"
              width="80"
              height="55"
            />
            {/* <Form inline>
              <FormControl type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-success">Search</Button>
            </Form>*/}
          </Navbar.Collapse>
        </Navbar>
      );  
  }
profileClick = () =>{
  this.props.history.push("/profile")
}
logoutClick = () => {
  localStorage.setItem("userId", null);
  localStorage.setItem("userToken", null);
  localStorage.setItem("userGroup", null);
  localStorage.setItem("followings",null);
  this.props.history.push("/login");
};
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
}

export default withRouter(TraderNavbar);
