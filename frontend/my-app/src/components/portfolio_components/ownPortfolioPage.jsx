import React, { Component } from 'react';
import {Button, Badge, Tabs, Tab, ListGroup, ListGroupItem} from "react-bootstrap";
import "./ownPortfolioPage.css";
import CreatePortfolio from "./createPortfolio";
import { FaFolderOpen, FaFolderPlus} from "react-icons/fa";
import axios from "axios";
import { withRouter } from "react-router-dom";
import PortfolioListHandler from "./portfolioListHandler";
import FollowingPortfolioListHandler from "./followingPortfolioListHandler";

class OwnPortfolioPage extends Component {
    constructor(props){
        super(props);
        this.state = { 
            portfolioList : [],
            followingPortfolioList: []
        }
    }
    
    render() { 
        var portfolioList2 = [];
        var followingPortfolioList = [];
        for(var i = 0; i < this.state.portfolioList.length; i++){
            portfolioList2.push(<PortfolioListHandler pk={this.state.portfolioList[i].pk} name={this.state.portfolioList[i].name}></PortfolioListHandler>);
        }
        for(var i = 0; i < this.state.followingPortfolioList.length; i++){
            followingPortfolioList.push(<FollowingPortfolioListHandler ownerId={this.state.followingPortfolioList[i].owner} pk={this.state.followingPortfolioList[i].pk} name={this.state.followingPortfolioList[i].name}></FollowingPortfolioListHandler>)
        }
        return ( 
            <div className="portfolio-outer-div">
                <Tabs defaultActiveKey="your-portfolios" style={{marginBottom:10, marginTop:10, margin:'auto', width:'70%',
                    fontWeight:'lighter',  justifyContent: 'center', backgroundColor:'whitesmoke' , borderRadius:"3px"}}>
                    <Tab eventKey="your-portfolios" title={<div><FaFolderOpen></FaFolderOpen> Your Portfolios</div>}>
                        <div style={{width:'70%', margin:'auto', marginTop:6}}className="your-portfolios-div">
                        <ListGroup>
                        {portfolioList2}
                    </ListGroup>
                        </div>
                    </Tab>
                    <Tab eventKey="create-portfolio"  title={<div><FaFolderPlus></FaFolderPlus>
                    Create a new Portfolio </div>} >
                        <CreatePortfolio></CreatePortfolio>
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
    listItemClick = (pk) => {
        var userId = localStorage.getItem("userId");
        this.props.history.push("/profile/" + userId + "/portfolio");
        this.props.history.push("/profile/" + localStorage.getItem("userId") +"/portfolio/" + toString(pk));
      };
    componentWillMount() {
        var userId = localStorage.getItem("userId");
        var token = localStorage.getItem("userToken");
        axios
          .get("http://8.209.81.242:8000/users/" + userId + "/portfolios",  {
            headers: { Authorization: `Token ${token}` }}).then(res => {
            this.setState({portfolioList: res.data});
          }
          );
          axios
          .get("http://8.209.81.242:8000/users/" + userId + "/following_portfolios",  {
            headers: { Authorization: `Token ${token}` }}).then(res => {
            this.setState({followingPortfolioList: res.data});
          }
          );
      }
}
 
export default withRouter(OwnPortfolioPage);
