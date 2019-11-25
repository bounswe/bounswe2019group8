import React, { Component } from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import ProfilePage from "./components/profile_components/ProfilePage";
import MainNavbar from "./components/nav_bars/mainNavbar";
import WholeArticlePage from "./components/article_components/wholeArticlePage";
import LoginRouter from "./containers/LoginRouter";
import SignupRouter from "./containers/SignupRouter";
import ArticleHolder from "./components/article_components/articleHolder";
import WriteArticlePage from "./components/article_components/writeArticlePage";
import Followings from "./components/profile_components/followings";
import SearchResults from "./components/profile_components/searchResults";
import ParityBadgeHolder from "./components/parity_components/parityBadgeHolder";
import WriteArticlePageSummoner from "./components/article_components/writeArticlePageSummoner";
import TradingEquipmentsPage from "./components/parity_components/tradingEquipmentsPage";
import Followers from "./components/profile_components/followers";
import OthersArticles from "./components/profile_components/othersArticles";
import VerificationFailPage from "./components/verificationFailPage";
import DoVerify from "./components/doVerify";
import EventsPage from "./components/event_components/event_page";

import GraphPage from "./components/parity_components/graphPage";

class Home extends Component {
  state = {};
  putParities(){
    if(localStorage.getItem("equipmentList") !== null){
      return <ParityBadgeHolder/>
    }
    else{
      return <div/>
    }
  }
  render() {
    return (
      <React.Fragment>
        <MainNavbar />
        <Switch>
          <Route exact path="/login" component={LoginRouter} />
          <Route exact path="/signup" component={SignupRouter} />
          <Route
            exact
            path="/profile/:id"
            exact
            key={Math.random() * 10}
            component={ProfilePage}
          />
          <Route
            exact
            path="/profile/:id/articles"
            exact
            key={Math.random() * 973}
            component={OthersArticles}
          />
          <Route
            exact
            path="/articles"
            exact
            key={Math.random() * 8123}
            component={ArticleHolder}
          />
          <Route
            exact
            path="/articles/:id"
            exact
            key={Math.random() * 1001231}
            component={WholeArticlePage}
          />
          <Route
            exact
            path="/followings"
            exact
            key={Math.random() * 1000}
            component={Followings}
          />
           <Route
            exact
            path="/followers"
            exact
            key={Math.random() * 88}
            component={Followers}
          />
          <Route
            exact
            path="/search/:search"
            exact
            key={Math.random() * 99}
            component={SearchResults}
          />
          <Route exact path="/articlewrite" component={WriteArticlePageSummoner} />
          <Route exact path="/treq" component={TradingEquipmentsPage}/>
          <Route exact path="/events" component={EventsPage}/>
          <Route exact path="/treq/:pk" component={GraphPage}/>
          <Route exact path="/verif_fail" component={VerificationFailPage}/>
          <Route exact path="/activations/:restOfUrl" component={DoVerify}/>
        </Switch>
        
      </React.Fragment>
    );
  }
}
export default Home;
