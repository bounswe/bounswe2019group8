import React, { Component } from 'react';
import axios from "axios";
import {Tabs, Tab, ListGroup, ListGroupItem, Dropdown} from "react-bootstrap";
import { FaFolderOpen, FaFolderPlus} from "react-icons/fa";
import "./mainInvestPage.css";
import ForexBuyDropDownHandler from "./forexBuyDropDownHandler";

class MainInvestPage extends Component {
    state = { 
        assets: [],
        forexAssets: [],
        allAssets: []
     }
    render() { 
       /* var data = {          //THIS PART IS FOR INITIAL USD LOAD.
            amount: 500000
          };
        var userId = localStorage.getItem("userId");
        var token = localStorage.getItem("userToken");
        axios
          .post("http://8.209.81.242:8000/users/" + userId + "/cash", data, {
            headers: { Authorization: `Token ${token}` }}).then(res => {
                console.log(res.data);
          }
          );*/
        var assetListItems = [];
        for(var i = 0; i < this.state.assets.length; i++){
        assetListItems.push(<ListGroupItem className="assets-list-item">
            <div className="assets-name-div">{this.state.assets[i].tr_eq.name}</div>
            <div className="assets-amount-div">{this.state.assets[i].amount}</div>
            </ListGroupItem>);
        }
        var forexList = [];
        var allExceptForexList = this.state.allAssets;
        for(var i = 0; i < allExceptForexList.length; i++){
            if(allExceptForexList[i].type == "forex"){
                forexList.push(allExceptForexList[i]);
                allExceptForexList.splice(i, 1);
                i -= 1;
            }
        }
        var forexBuyList = forexList;
        var forexBuyDropDownList = [];
        for(var i = 0; i < forexBuyList.length; i++){
            forexBuyDropDownList.push(<ForexBuyDropDownHandler asset={forexBuyList[i]}></ForexBuyDropDownHandler>)
        }
        return ( 
            <div>
                <Tabs defaultActiveKey="your-assets" style={{fontWeight:'lighter',  justifyContent: 'center', backgroundColor:'whitesmoke' , borderRadius:"3px"}}>
                    <Tab eventKey="your-assets" title={<div><FaFolderOpen></FaFolderOpen> Your Assets</div>}>
                        <div className="">
                        <ListGroup>
                        {assetListItems}
                    </ListGroup>
                        </div>
                    </Tab>
                    <Tab eventKey="forex" title={<div><FaFolderOpen></FaFolderOpen>Buy Forex Equipment</div>}>
                        <div className="forex-dropdown-div">
                        <Dropdown >
                            <Dropdown.Toggle className="forex-buy-dropdown" variant="success" id="dropdown-basic">
                            Buy:
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu-for-modal">
                             {forexBuyDropDownList}
                            </Dropdown.Menu>
                         </Dropdown>
                         <Dropdown >
                            <Dropdown.Toggle className="forex-sell-dropdown" variant="success" id="dropdown-basic">
                            Sell:
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu-for-modal">
                             {/*dsf*/}
                             </Dropdown.Menu>
                         </Dropdown>
                        </div>
                    </Tab>
                    <Tab eventKey="other" title={<div><FaFolderOpen></FaFolderOpen>Buy Other Equipment</div>}>
                        <div className="invest-div">
                        hello
                        </div>
                    </Tab>
                 </Tabs>
            </div>
         );
    }
  componentWillMount(){
        var userId = localStorage.getItem("userId");
        var token = localStorage.getItem("userToken");
        axios
          .get("http://8.209.81.242:8000/users/" + userId + "/assets", {
            headers: { Authorization: `Token ${token}` }}).then(res => {
                this.setState({assets: res.data});
          }
          );
        axios
          .get("http://8.209.81.242:8000/trading_equipments", {
            headers: { Authorization: `Token ${token}` }}).then(res => {
                this.setState({allAssets: res.data});
                console.log(res.data);
          }
          );
          
    }
}
 
export default MainInvestPage;