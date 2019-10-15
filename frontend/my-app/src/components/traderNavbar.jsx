import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import DropDownMenu from "./dropDownMenu";
import {
  Button,
  Form,
  Navbar,
  Nav,
  NavDropdown,
  FormGroup,
  FormControl,
  FormLabel
} from "react-bootstrap";

class TraderNavBar extends Component {
  state = {};

  render() {
    const navBarStyles = {
      color: "green",
      fontWeight: "bold"
    };
    const loginStyles = {
      margin: 10
    };

    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home" style={navBarStyles}>
          Mercatus
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Trading Equipment</Nav.Link>
            <Nav.Link href="#link">Events</Nav.Link>
            <Nav.Link href="#link">Articles</Nav.Link>
          </Nav>
          <NavDropdown title="User" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Settings</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Portfolio</NavDropdown.Item>
            <NavDropdown.Divider />
            <Button
              style={loginStyles}
              href="/signup"
              variant="outline-danger"
              size="sm"
            >
              Logout
            </Button>
          </NavDropdown>
          <Button style={loginStyles} href="/signup" variant="outline-danger">
            SignUp
          </Button>
          <Button style={loginStyles} href="/login" variant="outline-success">
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
}

export default TraderNavBar;
