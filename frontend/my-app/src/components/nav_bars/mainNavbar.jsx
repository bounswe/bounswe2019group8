import React, { Component } from "react";
import BasicNavbar from "./basicNavbar";
import TraderNavbar from "./traderNavbar";
import GuestNavbar from "./guestNavbar";



class MainNavbar extends Component {
  state = {};

  render() {
    if(localStorage.getItem("userGroup")==="1"){
      return(
      <React.Fragment>
        <BasicNavbar imageUrl={this.props.imageUrl} imageHandler = {this.props.imageHandler}/>
      </React.Fragment>)
    }
    else if(localStorage.getItem("userGroup")==="2"){
      return(
        <React.Fragment>
          <TraderNavbar imageUrl={this.props.imageUrl} imageHandler = {this.props.imageHandler}/>
        </React.Fragment>)
    }
    else{
      return(
        <React.Fragment>
          <GuestNavbar imageHandler = {this.props.imageHandler}/>
        </React.Fragment>)
    }
    
  }
}
export default MainNavbar;
