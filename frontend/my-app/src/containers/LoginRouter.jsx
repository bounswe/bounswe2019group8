import React, { Component } from "react";
import {withRouter} from "react-router-dom";
import Login from "./Login";
import axios from "axios";



class LoginRouter extends Component {
  state = { api : axios.create({
    baseURL: "http://8.209.81.242:8000/"
  })};

  render() {
   return( 
   <React.Fragment>
   <Login loginSuccess={this.loginSuccess} api={this.state.api} />
  </React.Fragment>)
    
  }
  loginSuccess = () =>{
    this.props.history.push("/profile/"+localStorage.getItem("userId"));
  }
}
export default withRouter(LoginRouter);