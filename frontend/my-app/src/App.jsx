import React, { Component } from "react";
import {Route} from "react-router-dom";
import Home from "./home";

class App extends Component {
  state = {};

  render() {
    return(
    <React.Fragment>
    <Route path="/" component={Home}/>
    </React.Fragment>
    )
  }
}
export default App;
