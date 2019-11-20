import React, { Component } from "react";
import {withRouter} from "react-router-dom";
import Signup from "./Signup";
import axios from "axios";



class SignupRouter extends Component {
  state = { api : axios.create({
    baseURL: "http://8.209.81.242:8000/"
  })};

  render() {
   return( 
   <React.Fragment>
   <Signup signUpSuccess={this.loginSuccess} api={this.state.api} />
  </React.Fragment>)
    
  }
  loginSuccess = () =>{
    this.props.history.push("/profile");
  }
}
export default withRouter(SignupRouter);