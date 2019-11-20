import React, { Component } from "react";
import "./App.css";
import GuestMainPage from "./components/main_pages/guestMainPage";
import BasicMainPage from "./components/main_pages/basicMainPage";
import TraderMainPage from "./components/main_pages/traderMainPage";
import TraderRouter from "./components/main_pages/traderRouter";
import {Route} from "react-router-dom";
import ProfilePage from "./components/profile_components/ProfilePage";



class Home extends Component {
  state = {};

  render() {
    if(localStorage.getItem("userGroup")==="0"){
      return(
      <React.Fragment>
        <BasicMainPage/>
      </React.Fragment>)
    }
    else if(localStorage.getItem("userGroup")==="1"){
      return(
        <React.Fragment>
          <TraderRouter/>
        </React.Fragment>)
    }
    else{
      return(
        <React.Fragment>
          <GuestMainPage/>
        </React.Fragment>)
    }
    
  }
}
export default Home;
