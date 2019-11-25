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
    var id = localStorage.getItem("userId");
    var token = localStorage.getItem("userToken");
    axios
    .get("http://8.209.81.242:8000/users/" + id, {
      headers: { Authorization: `Token ${token}` }
    })
    .then(res => {
      if(res.data.email_activated === false){
        localStorage.setItem("userToken", null);
        localStorage.setItem("equipmentList", null);
        localStorage.setItem("userId", null);
        localStorage.setItem("followings", null);
        localStorage.setItem("userGroup", null);
        this.props.history.push("/verif_fail/");
      }
      else{
        this.props.history.push("/profile/"+localStorage.getItem("userId"));
      }
    });
    
  }
}
export default withRouter(LoginRouter);