import React, { Component } from 'react';
import {Button, Badge, Tabs, Tab, ListGroup, ListGroupItem} from "react-bootstrap";
import "./ownPortfolioPage.css";
import { FaFolderOpen, FaFolderPlus} from "react-icons/fa";
import axios from "axios";
import { withRouter } from "react-router-dom";
import OthersPortfolioHandler from "./othersPortfolioHandler";
class OthersPortfolioPage extends Component {
    state = { 
        othersId: "",
        portfolioList: []
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
            portfolioList2.push(<OthersPortfolioHandler othersId={this.state.othersId} pk={pkList[i]} name={nameList[i]}></OthersPortfolioHandler>);
        }
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
                    <Tab eventKey="followed-portfolios" title={<div><FaFolderOpen></FaFolderOpen> Followed Portfolios </div>} >
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
      }

}
 
export default OthersPortfolioPage;