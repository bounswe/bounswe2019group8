import React, { Component } from "react";
import ParityBadge from "./parityBadge";
import "./parityBadgeHolder.css";
import {
    Button,
    Form,
    Navbar,
    Nav,
    NavDropdown,
    FormControl
  } from "react-bootstrap";
import NavLinkComponent from "./navLinkComponents";
import { FaSignOutAlt, FaListAlt, FaUserCircle, FaSearchDollar, FaThumbsDown } from "react-icons/fa";
import { MdSettings, MdChromeReaderMode } from "react-icons/md";
import GraphPage from "./graphPage";
  
class NewParitiesPage extends Component {
  state = {
  parityJson : JSON.parse(localStorage.getItem("equipmentList")),
  firstParityBadges:[],
  secondParityBadges:[],
  firstParity:"",
  secondParity:"",
  parityPk:0,
  parityGet:false,
  renderedGraph:(<div></div>)};
  componentDidMount(){
    var parityCheckList =[];
    var parityCheckList2 = [];
    var parityBadgeList = [];
    var parityBadgeList2 = [];
    var parityJson = this.state.parityJson;
    if(parityJson !== null){
      for (var i = 0; i < parityJson.length; i++) {
        if (parityCheckList.includes(parityJson[i].name.split("_")[0]) === false){
        parityCheckList.push (parityJson[i].name.split("_")[0])
        }
        if (parityCheckList2.includes(parityJson[i].name.split("_")[1]) === false){
        parityCheckList2.push (parityJson[i].name.split("_")[1])
        }  
      }
      parityCheckList.sort()
      parityCheckList2.sort()
      for (var i = 0; i < parityCheckList.length; i++) {
        parityBadgeList.push(
        <NavLinkComponent thisName={parityCheckList[i]} setParity={this.setFirstParity}></NavLinkComponent>);
      }
      for (var i = 0; i < parityCheckList2.length; i++) {
        parityBadgeList2.push(
        <NavLinkComponent thisName={parityCheckList2[i]} setParity={this.setSecondParity}></NavLinkComponent>);
      }  
      this.setState({firstParityBadges:parityBadgeList,secondParityBadges:parityBadgeList2})
    }
  }
  render() {
    if(this.state.parityGet){
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
          {this.state.firstParityBadges}
            </NavDropdown>
            <NavDropdown
              title="Second Parity"
              
              id="basic-nav-dropdown"
            >
          {this.state.secondParityBadges}
            </NavDropdown>
            <FormControl
                type="text"
                value={this.state.searchText}
                placeholder={this.state.firstParity}
                className="mr-sm-2"
                id = 'searchBar'
                onChange={this.changeHandler}
              />
               <FormControl
                type="text"
                placeholder={this.state.secondParity}
                className="mr-sm-2"
                id = 'searchBar'
                onChange={this.changeHandler}
              />
             <Button onClick={()=> this.handleSearchClick()} id='searchButton'  variant="outline-success">
                Find
            <FaSearchDollar style={{marginLeft: 6}}></FaSearchDollar>
            </Button>
          </Navbar.Collapse>
        </Navbar>
        {this.renderedGraph}
      </div>
      <GraphPage pk = {this.state.parityPk}/>
        </React.Fragment>
      );
    }else{
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
              {this.state.firstParityBadges}
                </NavDropdown>
                <NavDropdown
                  title="Second Parity"
                  
                  id="basic-nav-dropdown"
                >
              {this.state.secondParityBadges}
                </NavDropdown>
                <FormControl
                    type="text"
                    value={this.state.searchText}
                    placeholder={this.state.firstParity}
                    className="mr-sm-2"
                    id = 'searchBar'
                    onChange={this.changeHandler}
                  />
                   <FormControl
                    type="text"
                    placeholder={this.state.secondParity}
                    className="mr-sm-2"
                    id = 'searchBar'
                    onChange={this.changeHandler}
                  />
                   <Button onClick={()=> this.handleSearchClick()} id='searchButton'  variant="outline-success">
                    Find
                    <FaSearchDollar style={{marginLeft: 6}}></FaSearchDollar>
    
                  </Button>
              </Navbar.Collapse>
            </Navbar>
          </div>
            </React.Fragment>
          );
    }
  }
  setFirstParity = (firstParity2) =>{
      var newParity = firstParity2
    this.setState({firstParity:newParity})
  }
  setSecondParity = (firstParity2) =>{
    var newParity = firstParity2
  this.setState({secondParity:newParity})
  }
  handleSearchClick = () =>{
    console.log("basildim")
    var count = 0;
    this.state.parityJson.forEach((element)=>{
        if (element.name === this.state.firstParity + "_" + this.state.secondParity){
            this.setState({parityPk:element.pk})
            this.setState({parityGet:false})
            this.handeSearchFollow()              
        }
      });
        if (count === 0){
            this.setState({renderedGraph:<div />})
        }
    }
  handeSearchFollow = () =>{
    this.setState({parityGet:!this.state.parityGet}) 
  }

}

export default NewParitiesPage;
