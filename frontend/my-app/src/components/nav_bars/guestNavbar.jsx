import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./traderNavbar.css";
import axios from "axios";
import {
  Button,
  Form,
  Navbar,
  Nav,
  NavDropdown,
  FormControl
} from "react-bootstrap";
import { withRouter } from "react-router-dom";

class GuestNavbar extends Component {
  state = {};

  render() {
    localStorage.setItem("userId", "null");
    localStorage.setItem("followings", "null");
    localStorage.setItem("userToken", "null");
    localStorage.setItem("userType", "null");
    return (
      <Navbar bg="dark" expand="lg">
        <Navbar.Brand href="/" className="navBarSyles">
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
            <Nav.Link href="/articles">Articles</Nav.Link>
          </Nav>
          <Button
            id="loginStyles"
            class="myButton"
            onClick={() => this.signUpClick()}
            variant="outline-success"
          >
            Sign Up
          </Button>

          <Button
            id="loginStyles"
            class="myButton"
            onClick={() => this.loginClick()}
            variant="outline-success"
          >
            Login
          </Button>
          {/* <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>*/}
        </Navbar.Collapse>
      </Navbar>
    );
  }
  signUpClick = () => {
    this.props.history.push("/signup");
  };
  loginClick = () => {
    this.props.history.push("/login");
  };
  // !!!! This will add articles to guests too.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  /*componentDidMount() {
    axios.get("http://8.209.81.242:8000/articles").then(res => {
      //.setState({ articles: res.data });
      var articleList = res.data;
      console.log(articleList);
      console.log(JSON.stringify(articleList));
      localStorage.setItem("articleList", JSON.stringify(articleList));
      //this.setState({ gridOfArticles: articleCardList });
      console.log(localStorage.getItem("articleList"));
    });
  }*/
}

export default withRouter(GuestNavbar);