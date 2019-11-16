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

class GuestNavbar extends Component {
  state = {};

  render() {
      return (
        <Navbar bg="dark" expand="lg">
          <Navbar.Brand href="#" className="navBarSyles">
          <img
            src={require("./MERCATUS-LOGO72DP.png")}
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
            <button
              id="loginStyles"
              class="myButton"
              onClick={() => this.props.signUpClick()}
              //variant="outline-success"
            >
              SignUp
            </button>

            <button
              id="loginStyles"
              class="myButton"
              onClick={() => this.props.loginClick()}
              //variant="outline-success"
            >
              Login
            </button>
            {/* <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>*/}
          </Navbar.Collapse>
        </Navbar>
      );
    
  }
}

export default GuestNavbar;