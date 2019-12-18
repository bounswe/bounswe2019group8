import React, { Component } from 'react';
import "./singleOwnPortfolioPage.css";
import axios from "axios";
import {ListGroup, ListGroupItem, Badge} from "react-bootstrap";
import FollowPortfolioButton from "./followPortfolioButton";
class OthersSinglePortfolioPage extends Component {
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
        </ListGroupItem>)
        }
        return ( 
            <div className="single-portfolio-outer-div">
                <Badge>
                <h1 className="single-own-portfolio-header">{this.state.name}</h1>
                </Badge>
                <FollowPortfolioButton othersId={this.props.match.params.othersId} pk={this.props.match.params.pk}/>
                <Badge className="single-own-portfolio-treqs-badge">Equipment:</Badge>
                <ListGroup>
                    {groupItems}</ListGroup>
            </div>
         );
    }
    componentWillMount() {
        var token = localStorage.getItem("userToken");
        var trEqs = [];
        axios
          .get("http://8.209.81.242:8000/users/" + this.props.match.params.othersId + "/portfolios/" + this.props.match.params.pk, {
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
 
export default OthersSinglePortfolioPage;