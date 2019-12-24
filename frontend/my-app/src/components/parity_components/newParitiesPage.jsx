import React, { Component } from "react";
import "./parityBadgeHolder.css";
import {withRouter} from "react-router-dom";
import axios from "axios";
import {
    Button,
    Navbar,
    NavDropdown,
    FormControl,
    Nav
  } from "react-bootstrap";
import NavLinkComponent from "./navLinkComponents";
import { FaSignOutAlt, FaListAlt, FaUserCircle, FaSearchDollar, FaThumbsDown } from "react-icons/fa";
import GraphPage from "./graphPage";
  
class NewParitiesPage extends Component {
  state = {
  stockJson : JSON.parse(localStorage.getItem("equipmentList")),
  stockBadges:[],
  assetsBadges:[],
  forexBadges:[],
  dollarBadge:[],
  firstBadge:[ <NavDropdown.Item>Not Selected</NavDropdown.Item>],
  secondBadge:[ <NavDropdown.Item>Not Selected</NavDropdown.Item>],
  firstParity:"Not Selected",
  secondParity:"U.S. Dollar",
  buyWithParity:"U.S. Dollar",
  firstSym:"",
  secondSym:"USD_USD",
  buyWithSym:"USD_USD",
  currentAmount:0,
  currentBuyingAmount:0,
  firstType:null,
  SecondType:null,
  buyType:null,
  parityPk:0,
  buyWith:"",
  buyClicked:false,
  lastClicked:null,
  assets:null,
  buyAmount:0,
  refresh:true,
  rateType:"daily",
  reDo:true
   };
  componentWillMount(){
    var count1 =0
    var count2 =0;
    var allBadges ={commodity:[],stock:[],digital:[],forex:[],etf:[],index:[]};
    var stockJson = this.state.stockJson;
    var token = localStorage.getItem("userToken");
    var forexBadges= [];
    var dollarBadge=[];
    axios.get("http://8.209.81.242:8000/users/" + localStorage.getItem("userId")+"/assets", {
      headers: { Authorization: `Token ${token}` }
    }).then(res => {
      this.setState({assets: res.data});
      for (var i = 0; i < res.data.length; i++) {
          if(res.data[i].tr_eq.type === "forex"){
            if(res.data[i].tr_eq.sym === "USD_USD"){
              dollarBadge.push(
                <NavLinkComponent thisName={res.data[i].tr_eq.name} thisSymbol = {res.data[i].tr_eq.sym} thisPk={res.data[i].tr_eq.pk} setParity={this.setParity}></NavLinkComponent>
              )
            }
            forexBadges.push(
              <NavLinkComponent thisName={res.data[i].tr_eq.name} thisSymbol = {res.data[i].tr_eq.sym} thisPk={res.data[i].tr_eq.pk} setParity={this.setParity}></NavLinkComponent>
            )
          }
          if(res.data[i].tr_eq.sym === this.state.firstSym){
            this.setState({currentBuyingAmount:res.data[i].amount})
            count1 = count1 +1;
          }
          if(res.data[i].tr_eq.sym === this.state.buyWithSym){
            this.setState({currentAmount:res.data[i].amount})
            count2 = count2 +1;
          } 
      }
    });
    if(count1===0){
      this.setState({currentBuyingAmount:"0"})
    }
    if(count2===0){
      this.setState({currentBuyingAmount:"0"})
    }
    if(stockJson !== null){   
      for (var i = 0; i < stockJson.length; i++) {
        allBadges[stockJson[i].type].push(
          <NavLinkComponent thisName={stockJson[i].name} thisSymbol = {stockJson[i].sym} thisPk={stockJson[i].pk} setParity={this.setParity}></NavLinkComponent>);
        if(this.props.match.params.pk === stockJson[i].sym && this.state.reDo){
          this.setState({reDo:false, firstSym:stockJson[i].sym, firstParity:stockJson[i].name,firstType:stockJson[i].type, parityPk:stockJson[i].pk,parityGet:true})

        }
        }
      
    }
    this.setState({forexBadges:forexBadges,stockBadges:allBadges, dollarBadge:dollarBadge})
    if(this.state.firstType === "forex"){
      this.setState({assetsBadges:forexBadges})
    }
    else{
      this.setState({assetsBadges:dollarBadge})
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
              title="Rate" 
              id="basic-nav-dropdown"
            >
          <NavDropdown.Item onClick={() => this.setRateType("daily")}>Daily</NavDropdown.Item>
          <NavDropdown.Item onClick={() => this.setRateType("intradaily")}>IntraDaily</NavDropdown.Item>
            </NavDropdown>
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
                Buy/Sell
            
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
        <Nav color = "white" >
              <Nav.Link style={{color: 'white', textDecoration: 'none'}}>Buy/Sell</Nav.Link>
        </Nav>
        <FormControl
                readOnly
                type="text"
                placeholder={this.state.firstParity}
                className="mr-sm-2"
              /> 
         <Nav color = "white" >
              <Nav.Link style={{color: 'white', textDecoration: 'none'}}>Current</Nav.Link>
        </Nav>
        <FormControl
                readOnly
                type="text"
                placeholder={this.state.currentBuyingAmount}
                className="mr-sm-2"
              />      
        <NavDropdown
              title="Currency"
              id="basic-nav-dropdown"
              onClick={() => this.setLastClicked("buywith")}
            >
          {this.state.assetsBadges}
        </NavDropdown>
        <FormControl
                readOnly
                type="text"
                placeholder={this.state.buyWithParity}
                className="mr-sm-2"
        /> 
        <Nav color = "white" >
              <Nav.Link style={{color: 'white', textDecoration: 'none'}}>Current</Nav.Link>
        </Nav>
        <FormControl
                readOnly
                type="text"
                placeholder={this.state.currentAmount}
                className="mr-sm-2"
              /> 
          <Nav color = "white" >
              <Nav.Link style={{color: 'white', textDecoration: 'none'}}>Amount</Nav.Link>
        </Nav>
        <FormControl
                width = "%50"
                input type="number"
                placeholder={this.state.buyAmount}
                className="mr-sm-2"
                onChange={this.changeBuy}
              
        />
         <Button onClick={()=> this.handleCheckoutClick()} id='searchButton'  variant="outline-success">
                Buy
          </Button>
          <Button onClick={()=> this.handleSellClick()} id='searchButton'  variant="outline-success">
                Sell
          </Button>
        </Navbar>
        : <div/>
      }
      </div>
      { this.state.parityGet
        ? <GraphPage rateType={this.state.rateType} doubleTap={this.handleSearchClick} firstType={this.state.firstSym} secondType={this.state.secondSym} pk = {this.state.parityPk}/>
        : <div/>
      }
        </React.Fragment>
      );
    
  }
  setParity = (name, pk, symbol) =>{
   if(this.state.lastClicked==="first"){
    this.setState({firstParity:name, firstSym:symbol ,parityPk:pk})
    this.handleSearchClick()
    if(this.state.firstType === "forex"){
      this.setState({assetsBadges:this.state.forexBadges})
    }
    else{
      this.setState({assetsBadges:this.state.dollarBadge})
    }
    window.setTimeout(this.handleCheckOut, 30)   
   }
   if(this.state.lastClicked==="second"){
    this.setState({secondParity:name, secondSym:symbol})
    this.handleSearchClick();
   }
   if(this.state.lastClicked==="buywith"){
    this.setState({buyWithParity:name, buyWithSym:symbol})
    this.handleSearchClick();
    window.setTimeout(this.handleCheckOut, 30)   
   }

  }
  setSecondParity = (firstParity2) =>{
    var newParity = firstParity2
  this.setState({secondParity:newParity})
  }
  handleSearchClick = (e) =>{

            this.setState({parityGet:false})
            window.setTimeout(this.handeSearchFollow, 100)                    
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
  changeBuy = event => {
    this.setState({
      buyAmount: event.target.value
    });
  }
  handleCheckOut = () => {
    var token = localStorage.getItem("userToken");
    var count1=0
    var count2=0
    axios.get("http://8.209.81.242:8000/users/" + localStorage.getItem("userId")+"/assets", {
      headers: { Authorization: `Token ${token}` }
    }).then(res => {
      this.setState({assets: res.data});
      for (var i = 0; i < res.data.length; i++) {     
          if(res.data[i].tr_eq.sym === this.state.firstSym){
            this.setState({currentBuyingAmount:res.data[i].amount})
            count1 = count1 +1;
          }
          if(res.data[i].tr_eq.sym === this.state.buyWithSym){
            this.setState({currentAmount:res.data[i].amount})
            count2 = count2 +1;
          } 
      }
    });
    if(count1===0){
      this.setState({currentBuyingAmount:"0"})
    }
    if(count2===0){
      this.setState({currentBuyingAmount:"0"})
    }   
  }
  setRateType = (rateType) =>{
    this.setState({rateType:rateType})
    this.handleSearchClick()

  }
  handleCheckoutClick =()=>{
    axios.post("http://8.209.81.242:8000/users/" + localStorage.getItem("userId")+"/assets", 
    {
      sell_amount: parseFloat(this.state.buyAmount),
      buy_tr_eq_sym:this.state.firstSym,
      sell_tr_eq_sym:this.state.buyWithSym
    },
    {
      headers: {
        Authorization: `Token ${localStorage.getItem("userToken")}`
      }
    })
    window.setTimeout(this.handleCheckOut, 30)   
  }
  handleSellClick =()=>{
    axios.post("http://8.209.81.242:8000/users/" + localStorage.getItem("userId")+"/assets", 
    {
      sell_amount: parseFloat(this.state.buyAmount),
      buy_tr_eq_sym:this.state.buyWithSym,
      sell_tr_eq_sym:this.state.firstSym
    },
    {
      headers: {
        Authorization: `Token ${localStorage.getItem("userToken")}`
      }
    })
    window.setTimeout(this.handleCheckOut, 30)   
  }

}

export default withRouter(NewParitiesPage);
