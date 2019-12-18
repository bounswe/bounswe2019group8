import React, { Component } from 'react';
import {Button, Badge, Tabs, Tab, ListGroup, ListGroupItem} from "react-bootstrap";
import "./ownPortfolioPage.css";
import { FaFolderOpen, FaFolderPlus} from "react-icons/fa";
import axios from "axios";
import { withRouter } from "react-router-dom";
import OthersPortfolioHandler from "./othersPortfolioHandler";
import FollowingPortfolioListHandler from "./followingPortfolioListHandler";

class OthersPortfolioPage extends Component {
    state = { 
        othersId: "",
        portfolioList: [],
        followingPortfolioList: []
     }
     render() { 
        var portfolioList2 = [];
        var followingPortfolioList = [];
        for(var i = 0; i < this.state.portfolioList.length; i++){
            portfolioList2.push(<OthersPortfolioHandler othersId={this.state.othersId} pk={this.state.portfolioList[i].pk} name={this.state.portfolioList[i].name}></OthersPortfolioHandler>);
        }
        for(var i = 0; i < this.state.followingPortfolioList.length; i++){
            followingPortfolioList.push(<FollowingPortfolioListHandler ownerId={this.state.followingPortfolioList[i].owner} pk={this.state.followingPortfolioList[i].pk} name={this.state.followingPortfolioList[i].name}></FollowingPortfolioListHandler>)
        }
        return ( 
            <div className="portfolio-outer-div">
                <Tabs defaultActiveKey="your-portfolios" style={{fontWeight:'lighter',  justifyContent: 'center', backgroundColor:'whitesmoke' , borderRadius:"3px"}}>
                    <Tab eventKey="your-portfolios" title={<div><FaFolderOpen></FaFolderOpen>Portfolios</div>}>
                        <div className="your-portfolios-div">
                        <ListGroup>
                        {portfolioList2}
                    </ListGroup>
                        </div>
                    </Tab>
                    <Tab eventKey="followed-portfolios" title={<div><FaFolderOpen></FaFolderOpen> Followed Portfolios </div>} >
                    <ListGroup>
                    <div className="your-portfolios-div">
                        <ListGroup>
                        {followingPortfolioList}
                    </ListGroup>
                        </div>
                    </ListGroup>
                    </Tab>
                 </Tabs>
            </div>
         );
    }

    componentWillMount() {
        var token = localStorage.getItem("userToken");
        axios
          .get("http://8.209.81.242:8000/users/" + this.props.match.params.id + "/portfolios",  {
            headers: { Authorization: `Token ${token}` }}).then(res => {
            this.setState({portfolioList: res.data});
            this.setState({othersId: this.props.match.params.id});
          }
          );
          axios
          .get("http://8.209.81.242:8000/users/" + this.props.match.params.id + "/following_portfolios",  {
            headers: { Authorization: `Token ${token}` }}).then(res => {
            this.setState({followingPortfolioList: res.data});
          }
          );
      }
      

}
 
export default OthersPortfolioPage;