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
  
class NewParitiesPageBasic extends Component {
  state = {
  forexJson : JSON.parse(localStorage.getItem("equipmentList2")),
  stockJson : JSON.parse(localStorage.getItem("equipmentList")),
  digitalJson : JSON.parse(localStorage.getItem("equipmentList3")),
  forexBadges:[],
  digitalBadges:[],
  stockBadges:[],
  firstBadge:[ <NavDropdown.Item>Not Selected</NavDropdown.Item>],
  secondBadge:[ <NavDropdown.Item>Not Selected</NavDropdown.Item>],
  firstParity:"Not Selected",
  secondParity:"USD",
  firstSym:"",
  secondSym:"",
  firstType:"Not Selected",
  SecondType:"Not Selected",
  parityPk:0,
  buyClicked:false,
  lastClicked:null
   };
  componentDidMount(){
    var allBadges ={commodity:[],stock:[],digital:[],forex:[],etf:[],index:[]};
    var stockJson = this.state.stockJson;
    if(stockJson !== null){   
      for (var i = 0; i < stockJson.length; i++) {
        allBadges[stockJson[i].type].push(
          <NavLinkComponent thisName={stockJson[i].name} thisSymbol = {stockJson[i].sym.split("_")[0]} thisPk={stockJson[i].pk} setParity={this.setParity}></NavLinkComponent>);
      }
      this.setState({stockBadges:allBadges})
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
              title="Main Parity Type" 
              id="basic-nav-dropdown"
            >
          <NavDropdown.Item onClick={() => this.setFirtsParityType("commodity")}>Commodity</NavDropdown.Item>
          <NavDropdown.Item onClick={() => this.setFirtsParityType("etf")}>ETF</NavDropdown.Item>
          <NavDropdown.Item onClick={() => this.setFirtsParityType("index")}>Index</NavDropdown.Item>
          <NavDropdown.Item onClick={() => this.setFirtsParityType("stock")}>Stock</NavDropdown.Item>
          <NavDropdown.Item onClick={() => this.setFirtsParityType("forex")}>Forex</NavDropdown.Item>
          <NavDropdown.Item onClick={() => this.setFirtsParityType("digital")}>Digital</NavDropdown.Item>
            </NavDropdown>
            <FormControl
                readOnly
                type="text"
                placeholder={this.state.firstType}
                className="mr-sm-2"
              /> 
            <NavDropdown
              title="Main Parity"
              id="basic-nav-dropdown"
              onClick={() => this.setLastClicked("first")}
            >
          {this.state.firstBadge}
            </NavDropdown>
            <FormControl
                readOnly
                type="text"
                placeholder={this.state.firstParity}
                className="mr-sm-2"
              />
            <NavDropdown
              title="Compare Parity Type"
              id="basic-nav-dropdown"
            >
          <NavDropdown.Item onClick={() => this.setSecondParityType("commodity")}>Commodity</NavDropdown.Item>
          <NavDropdown.Item onClick={() => this.setSecondParityType("etf")}>ETF</NavDropdown.Item>
          <NavDropdown.Item onClick={() => this.setSecondParityType("index")}>Index</NavDropdown.Item>
          <NavDropdown.Item onClick={() => this.setSecondParityType("stock")}>Stock</NavDropdown.Item>
          <NavDropdown.Item onClick={() => this.setSecondParityType("forex")}>Forex</NavDropdown.Item>
          <NavDropdown.Item onClick={() => this.setSecondParityType("digital")}>Digital</NavDropdown.Item>
            </NavDropdown>
            <FormControl
                readOnly
                type="text"
                placeholder={this.state.secondType}
                className="mr-sm-2"
              /> 
            <NavDropdown
              title="Compare Parity"
              id="basic-nav-dropdown"
              onClick={() => this.setLastClicked("second")}
            >
          {this.state.secondBadge}
            </NavDropdown>
               <FormControl
                readOnly
                type="text"
                placeholder={this.state.secondParity}
                className="mr-sm-2"
              />
             <Button onClick={()=> this.handleBuyClick()} id='searchButton'  variant="outline-success">
                Buy
            <FaSearchDollar style={{marginLeft: 6}}></FaSearchDollar>
            </Button>
          </Navbar.Collapse>
        </Navbar>
        { this.state.buyClicked?
        <Navbar bg="dark" expand="lg" >
        <Navbar.Toggle
          class="navbar-toggler"
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
        </Navbar>
        : <div/>
      }
       
      </div>
      { this.state.parityGet
        ? <GraphPage doubleTap={this.handleSearchClick} pk = {this.state.parityPk}/>
        : <div/>
      }
        </React.Fragment>
      );
    
  }
  setParity = (name, pk, symbol) =>{
   if(this.state.lastClicked==="first"){
    this.setState({firstParity:name, firstSym:symbol,parityPk:pk})
    this.handleSearchClick()
   }
   if(this.state.lastClicked==="second"){
    this.setState({secondParity:name, secondSym:symbol})
  }

  }
  setSecondParity = (firstParity2) =>{
    var newParity = firstParity2
  this.setState({secondParity:newParity})
  }
  handleSearchClick = (e) =>{
    console.log("basildim")
            this.setState({parityGet:false})
            window.setTimeout(this.handeSearchFollow, 30)                    
    }
  handeSearchFollow = () =>{
    this.setState({parityGet:!this.state.parityGet}) 
  }
  setFirtsParityType = (firstParity) =>{
      this.setState({firstBadge:this.state.stockBadges[firstParity], firstType:firstParity})
  }
  setSecondParityType = (secondParity) =>{
    this.setState({secondBadge:this.state.stockBadges[secondParity], secondType:secondParity})
  }
  setLastClicked = (lastClicked) =>{
    this.setState({lastClicked:lastClicked})
  }
  handleBuyClick = () =>{
    this.setState({buyClicked:!this.state.buyClicked});

  }
}

export default NewParitiesPageBasic;
