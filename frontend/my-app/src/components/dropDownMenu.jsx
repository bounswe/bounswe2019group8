import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";

class DropDownMenu extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <a className="dropdown-item" href="#">
          Action
        </a>
        <a className="dropdown-item" href="#">
          Another action
        </a>
        <div className="dropdown-divider"></div>
        <a className="dropdown-item" href="#">
          Something else here
        </a>
      </React.Fragment>
    );
  }
}

export default DropDownMenu;
