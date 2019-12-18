import React, { Component } from 'react';
import axios from "axios";
import {ListGroup, ListGroupItem, Badge} from "react-bootstrap";
import "./singleOwnPortfolioPage.css";
import AddTreqModal from "./addTreqModal";
import RemoveTrEqButton from "./removeTrEqButton";
class SingleOwnPortfolioPage extends Component {
    state = { 
        trEqs: [],
        name: "",
        yesNo: true
     }
    render() { 
        var groupItems = [];
        for(var i = 0; i < this.state.trEqs.length; i++){
        groupItems.push(<ListGroupItem className="single-own-portfolio-list-group-items">
            <Badge className="single-own-portfolio-inlist-badge"> {this.state.trEqs[i].sym}</Badge>
        <RemoveTrEqButton pk={this.props.match.params.pk} trEqs={this.state.trEqs} sym={this.state.trEqs[i].sym}></RemoveTrEqButton>
        </ListGroupItem>)
        }
        return ( 
            <div className="single-portfolio-outer-div">
                <Badge>
                <h1 className="single-own-portfolio-header">{this.state.name}</h1>
                </Badge>
                
                <AddTreqModal onAddTreqModal={() => this.justToReRender()} pk={this.props.match.params.pk} name={this.state.name} prevEqs={this.state.trEqs}></AddTreqModal>
                <Badge className="single-own-portfolio-treqs-badge">Equipment:</Badge>
                <ListGroup>
                    {groupItems}</ListGroup>
            </div>
         );
    }
    justToReRender = () => {
        console.log("neden bro");
        this.componentDidMount();
        this.setState({yesNo: !this.state.yesNo});
    }
    componentDidMount(){
        this.setState({yesNo: !this.state.yesNo});
    }
    componentWillMount() {
        var userId = localStorage.getItem("userId");
        var token = localStorage.getItem("userToken");
        var trEqs = [];
        axios
          .get("http://8.209.81.242:8000/users/" + userId + "/portfolios/" + this.props.match.params.pk, {
            headers: { Authorization: `Token ${token}` }}).then(res => {
                for(var i = 0; i < res.data.tr_eqs.length; i++){
                    trEqs.push(res.data.tr_eqs[i]);
                }
                this.setState({name: res.data.name})
                this.setState({trEqs: trEqs});
          }
    
          );
        
    
      }
      
}
 
export default SingleOwnPortfolioPage;