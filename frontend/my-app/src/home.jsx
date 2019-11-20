import React, { Component } from "react";
import "./App.css";
import {Route, Switch} from "react-router-dom";
import ProfilePage from "./components/profile_components/ProfilePage";
import MainNavbar from "./components/nav_bars/mainNavbar";

import LoginRouter from "./containers/LoginRouter";
import SignupRouter from "./containers/SignupRouter";
class Home extends Component {
  state = {};

  render() {
    return( 
   <React.Fragment>
    
      <MainNavbar/>
      <Switch>
        <Route exact path="/login" component ={LoginRouter}/>
        <Route exact path="/signup" component ={SignupRouter}/>
        <Route exact path ="/profile/:id" component={ProfilePage}/>
      </Switch>
  
  </React.Fragment>)
    
  }
}
export default Home;
