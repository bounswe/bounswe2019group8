import React, { Component } from 'react';
import {Button, Badge, Tabs, Tab, ListGroup, ListGroupItem} from "react-bootstrap";
import "./ownPortfolioPage.css";
import CreatePortfolio from "./createPortfolio";
import { FaFolderOpen, FaFolderPlus} from "react-icons/fa";
import axios from "axios";
import { withRouter } from "react-router-dom";
import PortfolioListHandler from "./portfolioListHandler";

class OwnPortfolioPage extends Component {
    state = { 
        portfolioList : []
     }
    render() { 
        var portfolioList2 = [];
        var pkList = [];
        var nameList = [];
        for(var i = 0; i < this.state.portfolioList.length; i++){
            pkList.push(this.state.portfolioList[i].pk);
            nameList.push(this.state.portfolioList[i].name);
        }
        for(var i = 0; i < this.state.portfolioList.length; i++){
            portfolioList2.push(<PortfolioListHandler pk={pkList[i]} name={nameList[i]}></PortfolioListHandler>);
        }
        console.log(portfolioList2);
        return ( 
            <div className="portfolio-outer-div">
                <Tabs defaultActiveKey="your-portfolios" style={{fontWeight:'lighter',  justifyContent: 'center', backgroundColor:'whitesmoke' , borderRadius:"3px"}}>
                    <Tab eventKey="your-portfolios" title={<div><FaFolderOpen></FaFolderOpen> Your Portfolios</div>}>
                        <div className="your-portfolios-div">
                        <ListGroup>
                        {portfolioList2}
                    </ListGroup>
                        </div>
                    </Tab>
                    <Tab eventKey="create-portfolio" title={<div><FaFolderPlus></FaFolderPlus>
                    Create a new Portfolio </div>} >
                        <CreatePortfolio></CreatePortfolio>
                    </Tab>
                    <Tab eventKey="followed-portfolios" title={<div><FaFolderOpen></FaFolderOpen> Followed Portfolios </div>} >
                    </Tab>
                 </Tabs>
            </div>
         );
    }
    listItemClick = (pk) => {
        var userId = localStorage.getItem("userId");
        console.log(toString(pk));
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
            console.log(this.state.portfolioList);
          }
    
          );
    
      }
}
 
export default withRouter(OwnPortfolioPage);