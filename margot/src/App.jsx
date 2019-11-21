import React, { Component } from "react";
import Home from "./Home";
import MainNavbar from "./components/nav_bars/mainNavbar";

class App extends Component {
  render() {
    return (
      <React.Fragment>
      <MainNavbar/>
      <Home/>
      </React.Fragment>)
    }
  }
  export default App;
