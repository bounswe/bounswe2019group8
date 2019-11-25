import React, { Component } from "react";
import BasicNavbar from "./basicNavbar";
import TraderNavbar from "./traderNavbar";
import GuestNavbar from "./guestNavbar";



class MainNavbar extends Component {
  state = {};

  render() {
    if(localStorage.getItem("userGroup")==="0"){
      return(
      <React.Fragment>
        <BasicNavbar/>
      </React.Fragment>)
    }
    else if(localStorage.getItem("userGroup")==="1"){
      return(
        <React.Fragment>
          <TraderNavbar/>
        </React.Fragment>)
    }
    else{
      return(
        <React.Fragment>
          <GuestNavbar/>
        </React.Fragment>)
    }
    
  }
}
export default MainNavbar;