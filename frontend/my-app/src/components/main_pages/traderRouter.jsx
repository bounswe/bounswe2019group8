import React, { Component } from "react";
import {Route} from "react-router-dom";
import ProfilePage from "../profile_components/ProfilePage";
import TraderMainPage from "./traderMainPage";

class TraderRouter extends Component {
  state = {};

  render() {
    return(
    <React.Fragment>
    <TraderMainPage/>
    </React.Fragment>
    )
  }
}
export default TraderRouter;
