import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import DropDownMenu from "./dropDownMenu";

class NavBar extends Component {
  state = {
    isOpen: false,
    dropDownMenuM: [{}]
  };

  handleDropDown = () => {
    this.setState({ isOpen: !this.state.isOpen });
    let dropDownMenuM = this.state.dropDownMenuM;
    if (this.state.isOpen) {
      dropDownMenuM[0] = { id: 1 };
      this.setState({ dropDownMenuM });
    } else {
      {
        dropDownMenuM.pop();
        this.setState({ dropDownMenuM });
      }
    }
  };

  render() {
    const navBarStyles = {
      color: "green",
      fontWeight: "bold"
    };
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a style={navBarStyles} className="navbar-brand" href="#">
          Mercatus
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Link
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                onClick={this.handleDropDown}
              >
                Dropdown
              </a>
              {/*The dropdown menu comes here*/}
              {this.state.dropDownMenuM.map(myDropDownMenu => (
                <DropDownMenu
                  key={myDropDownMenu.id}
                  dropDownMenu={myDropDownMenu}
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdown"
                />
              ))}
            </li>
            <li className="nav-item">
              <a
                className="nav-link disabled"
                href="#"
                tabindex="-1"
                aria-disabled="true"
              >
                Disabled
              </a>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </nav>
    );
  }
}

export default NavBar;
