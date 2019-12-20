import React, { Component } from "react";
import "./parityBadgeHolder.css";
import {
    Button,
    Navbar,
    NavDropdown,
    FormControl
  } from "react-bootstrap";
import NavLinkComponent from "./navLinkComponents";
import { FaSignOutAlt, FaListAlt, FaUserCircle, FaSearchDollar, FaThumbsDown } from "react-icons/fa";
import GraphPage from "./graphPage";
  
class NewParitiesPage extends Component {
  state = {
  forexJson : JSON.parse(localStorage.getItem("equipmentList2")),
  stockJson : JSON.parse(localStorage.getItem("equipmentList")),
  digitalJson : JSON.parse(localStorage.getItem("equipmentList3")),
  forexBadges:["Not Selected"],
  digitalBadges:["Not Selected"],
  stockBadges:["Not Selected"],
  firstBadge:["Not Selected"],
  secondBadge:["Not Selected"],
  firstParity:"",
  secondParity:"USD",
  parityPk:0,
  parityGet:false,
  firstParityType:null,
  secondParityType:null,
  renderedGraph:(<div></div>)};
  componentDidMount(){
    var forexCheckList =[];
    var forexBadgeList = [];
    var stockCheckList =[];
    var stockBadgeList = [];
    var digitalCheckList =[];
    var digitalBadgeList = [];
    var stockJson = this.state.stockJson;
    var forexJson = this.state.forexJson;
    var digitalJson = this.state.digitalJson;
    if(forexJson !== null){
      for (var i = 0; i < forexJson.length; i++) {
        if (forexCheckList.includes(forexJson[i].sym.split("_")[0]) === false){
        forexCheckList.push (forexJson[i].sym.split("_")[0])
        } 
      }
      forexCheckList.sort()
      for (var i = 0; i < forexCheckList.length; i++) {
        forexBadgeList.push(
        <NavLinkComponent thisName={forexCheckList[i]} setParity={this.setParity}></NavLinkComponent>);
      }
      this.setState({forexBadges:forexBadgeList})
    }
    if(stockJson !== null){
      for (var i = 0; i < stockJson.length; i++) {
        if (stockCheckList.includes(stockJson[i].sym.split("_")[0]) === false){
        stockCheckList.push (stockJson[i].sym.split("_")[0])
        } 
      }
      stockCheckList.sort()
      for (var i = 0; i < stockCheckList.length; i++) {
        stockBadgeList.push(
        <NavLinkComponent thisName={stockCheckList[i]} setParity={this.setParity}></NavLinkComponent>);
      }
      this.setState({stockBadges:stockBadgeList})
    }
    if(forexJson !== null){
      for (var i = 0; i < forexJson.length; i++) {
        if (forexCheckList.includes(forexJson[i].sym.split("_")[0]) === false){
        forexCheckList.push (forexJson[i].sym.split("_")[0])
        } 
      }
      forexCheckList.sort()
      for (var i = 0; i < forexCheckList.length; i++) {
        forexBadgeList.push(
        <NavLinkComponent thisName={forexCheckList[i]} setParity={this.setParity}></NavLinkComponent>);
      }
      this.setState({forexBadges:forexBadgeList})
    }
  }
  render() {
      return (
        <React.Fragment>
         <div>
        <Navbar bg="dark" expand="lg" >
          <Navbar.Toggle
            class="navbar-toggler"
            aria-controls="basic-navbar-nav"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <NavDropdown
              title="First Parity"
              
              id="basic-nav-dropdown"
            >
          {this.state.forexBadges}
            </NavDropdown>
            <NavDropdown
              title="Second Parity"
              
              id="basic-nav-dropdown"
            >
          {this.state.secondForexBadges}
            </NavDropdown>
            <FormControl
                readOnly
                type="text"
                value={this.state.searchText}
                placeholder={this.state.firstParity}
                className="mr-sm-2"
                id = 'searchBar'
              />
               <FormControl
                type="text"
                placeholder={this.state.secondParity}
                className="mr-sm-2"
                id = 'searchBar'
              />
             <Button onClick={()=> this.handleSearchClick()} id='searchButton'  variant="outline-success">
                Find
            <FaSearchDollar style={{marginLeft: 6}}></FaSearchDollar>
            </Button>
          </Navbar.Collapse>
        </Navbar>
        {this.renderedGraph}
      </div>
      { this.state.parityGet
        ? <GraphPage doubleTap={this.handleSearchClick} pk = {this.state.parityPk}/>
        : <div/>
      }
      
        </React.Fragment>
      );
    
  }
  setParity = (firstParity2) =>{
      var newParity = firstParity2
    this.setState({firstParity:newParity})
  }
  setSecondParity = (firstParity2) =>{
    var newParity = firstParity2
  this.setState({secondParity:newParity})
  }
  handleSearchClick = (e) =>{
    console.log("basildim")
    var count = 0;
    this.state.forexJson.forEach((element)=>{
        if (element.sym === this.state.firstParity + "_" + this.state.secondParity){
            this.setState({parityPk:element.pk})
            this.setState({parityGet:false})
            window.setTimeout(this.handeSearchFollow, 30)                    
        }
      });
        if (count === 0){
            this.setState({renderedGraph:<div />})
        }
    }
  handeSearchFollow = () =>{
    this.setState({parityGet:!this.state.parityGet}) 
  }
  setFirtsParityType = (firstParity) =>{

  }
  setSecondParityType = (secondParity) =>{

  }

}

export default NewParitiesPage;
