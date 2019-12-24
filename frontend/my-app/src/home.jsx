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
import ArticleHolder2 from "./components/article_components/articleHolder2";
import OwnPortfolioPage from "./components/portfolio_components/ownPortfolioPage";
import OthersPortfolioPage from "./components/portfolio_components/othersPortfolioPage";
import SingleOwnPortfolioPage from "./components/portfolio_components/singleOwnPortfolioPage";
import OthersSinglePortfolioPage from "./components/portfolio_components/othersSinglePortfolioPage";
import GuestArticleHolder from "./components/article_components/guestArticleHolder";
import NewParitiesPage from "./components/parity_components/newParitiesPage";
import { ListGroupItem, ListGroup } from "react-bootstrap";

import UpdatePage from "./components/profile_components/updatePage";
import NotifPage from "./components/notification_components/notifPage";

import { Row, Col, Card } from "react-bootstrap";
import axios from "axios";

class Home extends Component {
  constructor(){
    super();
    this.state = {
      imageUrl: '',
      portfolios: [],
      priceMap: {},
    };
    this.imageChangeHandler = this.imageChangeHandler.bind(this)
  }

  putParities(){
    if(localStorage.getItem("equipmentList") !== null){
      return <ParityBadgeHolder/>
    }
    else{
      return <div/>
    }
  }

  imageChangeHandler(url){
    this.setState({
      imageUrl: url
    })
  }

  getName(sym) {
    const tradingEquipments = JSON.parse(localStorage.getItem("equipmentList"));

    return tradingEquipments.find(trEq => (trEq.sym === sym)).name;
  }

  getPrice(sym) {
    const tradingEquipments = JSON.parse(localStorage.getItem("equipmentList"));

    const price = Math.round(this.state.priceMap[tradingEquipments.find(trEq => (trEq.sym === sym)).pk]*100)/100;

    if (isNaN(price))
      return "";

    return `${price}$`;
  }

  updatePrices() {
      if (this.props.location.pathname.length > 1)
        return;
      for (const portfolio of this.state.portfolios) {
        for (const eq of portfolio.tr_eqs) {

          axios
            .get(`trading_equipments/${eq.sym}/prices/current`, {
              headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }}).then(res => {
                  const data = res.data;
                  this.setState({ priceMap: {...this.state.priceMap, [data.tr_eq]: data.indicative_value} });

            }

            );
        }

      }

  }

  renderPorfolio(p) {
    return <Card>
    <Card.Title>{p.name}</Card.Title>

    <Card.Body>
    <ListGroup className="list-group-flush">
      {p.tr_eqs.map(eq => <ListGroupItem action href={"/treq/"+ eq.sym}>{this.getName(eq.sym)}({eq.sym}) {this.getPrice(eq.sym)}</ListGroupItem>)}
    </ListGroup>
    </Card.Body>
    </Card>;
  }

  renderHome() {
    return (<Row>
      <Col><h2 className="text-center" style={{color:"#fff", borderRadius: 10, backgroundColor: "orange"}}>Articles</h2><ArticleHolder2/></Col>
      <Col><h2 className="text-center" style={{color:"#fff", borderRadius: 10, backgroundColor: "orange"}}>Portfolios</h2>{this.state.portfolios.map(p => this.renderPorfolio(p))}</Col>
    </Row>
  );
  }

  componentDidMount() {
    axios
      .get("users/" + localStorage.getItem("userId") + "/portfolios", {
        headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }}).then(res => {
            const portfolios = res.data;
            this.setState({ portfolios });

      }

    ).then(() => {
      axios
        .get("users/" + localStorage.getItem("userId") + "/following_portfolios", {
          headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }}).then(res => {
              const portfolios = res.data;
              this.setState({ portfolios: [...this.state.portfolios, ...portfolios] });

        }

      )
    });

      this.timer = setInterval(() => {
        this.updatePrices();

    }, 3000);

  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    console.log(this.props);
    return (
      <React.Fragment>
        <MainNavbar imageHandler={() => this.imageChangeHandler} imageUrl={this.state.imageUrl}/>

        <Switch>
          <Route exact path="/login" component={LoginRouter} />
          <Route exact path="/signup" component={SignupRouter} />
          <Route
            exact
            path="/profile/:id"
            exact
            key={Math.random() * 10}
            render={(props) => <ProfilePage {...props} imageUrl={this.state.imageUrl} imageHandler={() => this.imageChangeHandler}/>}
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
            path="/guest/articles"
            exact
            key={Math.random() * 973}
            component={GuestArticleHolder}
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
          <Route
            exact
            path="/profile/:id/portfolio"
            exact
            key={Math.random() * 99}
            component={OwnPortfolioPage}
          />
          <Route
            exact
            path="/profile/:id/others_portfolio"
            exact
            key={Math.random() * 99}
            component={OthersPortfolioPage}
          />
          <Route
            exact
            path="/profile/:id/notif"
            exact
            key={Math.random() * 99}
            component={NotifPage}
          />
          <Route
            exact
            path="/profile/:id/portfolio/:pk"
            exact
            key={Math.random() * 99}
            component={SingleOwnPortfolioPage}
          />
           <Route
            exact
            path="/profile/:othersId/others_portfolio/:pk"
            exact
            key={Math.random() * 99}
            component={OthersSinglePortfolioPage}
          />
          <Route
            exact
            path="/events#:eventId"
            exact
            key={Math.random() * 99}
            component={EventsPage}
          />
               <Route
            exact
            path="/treq/:pk"
            exact
            key={Math.random() * 99}
            component={NewParitiesPage}
          />
            <Route
            exact
            path="/guest/treq"
            exact
            key={Math.random() * 99}
            component={NewParitiesPage}
          />
          <Route exact path="/articlewrite" component={WriteArticlePageSummoner} />
          <Route exact path="/events" component={EventsPage}/>
          <Route exact path="/verif_fail" component={VerificationFailPage}/>
          <Route exact path="/activations/:restOfUrl/:rest" component={DoVerify}/>
          <Route exact path="/upd_cred" component={UpdatePage}/>
        </Switch>
        {(this.props.location.pathname.length <= 1)&& (localStorage.getItem("userToken")) && this.renderHome()}



      </React.Fragment>
    );
  }
}
export default Home;
