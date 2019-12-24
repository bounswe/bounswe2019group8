import React, { Component } from "react";
import {Route} from "react-router-dom";


import {
    Button,
    Form,
    Navbar,
    Nav,
    NavDropdown,
    FormControl
  } from "react-bootstrap";

class NavLinkComponent extends Component {
  state = {};

  render() {
    return(
        
        <NavDropdown.Item  onClick={() => this.props.setParity(this.props.thisName, this.props.thisPk, this.props.thisSymbol)}>
        {this.props.thisName}
        </NavDropdown.Item>
        
    )
  }
}
export default NavLinkComponent;
