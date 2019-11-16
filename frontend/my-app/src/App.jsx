import React, { Component } from "react";
import "./App.css";
import GuestMainPage from "./components/guestMainPage";
import BasicMainPage from "./components/basicMainPage";
import TraderMainPage from "./components/traderMainPage";



class App extends Component {
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
          <TraderMainPage/>
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
export default App;
