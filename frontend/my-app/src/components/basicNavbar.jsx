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

class BasicNavbar extends Component {
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
            <Form inline>
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2"
              />
              <Button
                variant="outline-success"
                onClick={() => this.props.searchClick()}
              >
                Search
              </Button>
            </Form>
            <NavDropdown
              title={
                this.props.credentials.firstName +
                " " +
                this.props.credentials.lastName
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item
                href="#"
                onClick={() => this.props.profileClick()}
              >
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item href="#">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <Button
                id="loginStyles"
                onClick={() => this.props.logoutClick()}
                variant="outline-danger"
                size="sm"
                background-color="white"
              >
                Logout
              </Button>
            </NavDropdown>
            <img
              className="rounded-circle"
              src={require("./rick.jpg")}
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


}

export default BasicNavbar;
