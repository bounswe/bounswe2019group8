import React, { Component } from "react";
import "./App.css";
import {Route} from "react-router-dom";

import Signup from "./containers/Signup";

//import ComposeArticle from "./components/ComposeArticle";

class Home extends Component {
  render() {
    return(
      <React.Fragment>


      <Route exact path="/signup" component ={Signup}/>


      </React.Fragment>
    )
  }
}

/*
import Profile from "./containers/Profile";
import Login from "./containers/Login";
import Articles from "./containers/articles";
class Home extends Component {
  render() {
    return(
      <React.Fragment>

      <Route exact path="/login" component ={Login}/>
      <Route exact path="/signup" component ={Signup}/>

      <Route exact path ="/profile/:id" component={Profile}/>

      <Route exact path ="/articles" component={Articles} />
      <Route path ="/articles/compose" component={ComposeArticle}/>s

      </React.Fragment>
    )
  }
}*/

export default Home;
