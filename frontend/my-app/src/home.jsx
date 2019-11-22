import React, { Component } from "react";
import "./App.css";
import {Route, Switch} from "react-router-dom";
import ProfilePage from "./components/profile_components/ProfilePage";
import MainNavbar from "./components/nav_bars/mainNavbar";
import WholeArticlePage from "./components/article_components/wholeArticlePage"
import LoginRouter from "./containers/LoginRouter";
import SignupRouter from "./containers/SignupRouter";
import RealArticleHolder from "./components/article_components/realArticleHolder";
import WriteArticlePage from "./components/article_components/writeArticlePage";
import Followings from "./components/profile_components/followings";
import SearchResults from "./components/profile_components/searchResults";

class Home extends Component {
  state = {};

  render() {
    return( 
   <React.Fragment>
     
      <MainNavbar/>
     
        <Switch>
        <Route exact path="/login" component ={LoginRouter}/>
        <Route exact path="/signup" component ={SignupRouter}/>
        <Route exact path ="/profile/:id" exact key ={Math.random()*10} component={ProfilePage}/>
        <Route exact path ="/articles" exact key ={Math.random()*100} component={RealArticleHolder} />
        <Route exact path ="/followings" exact key ={Math.random()*1000} component={Followings}/> 
        <Route exact path ="/search/:search" exact key ={Math.random()*99} component={SearchResults}/> 
        <Route path ="/articles/write" component={WriteArticlePage}/>
        </Switch>
  
  </React.Fragment>)
    
  }
}
export default Home;
