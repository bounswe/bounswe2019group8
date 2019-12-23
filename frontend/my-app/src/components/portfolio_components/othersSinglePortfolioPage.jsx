import React, { Component } from 'react';
import "./singleOwnPortfolioPage.css";
import axios from "axios";
import { ListGroup, ListGroupItem, Badge } from "react-bootstrap";
import FollowPortfolioButton from "./followPortfolioButton";

import {MdDoNotDisturbOn} from 'react-icons/md'
class OthersSinglePortfolioPage extends Component {
    state = {
        trEqs: [],
        name: "",
        owner: '',
        yesNo: true
    }

    getName(sym) {
        const tradingEquipments = JSON.parse(localStorage.getItem("equipmentList"));

        return tradingEquipments.find(trEq => (trEq.sym === sym)).name;
    }

    render() {
        var groupItems = [];
        for (var i = 0; i < this.state.trEqs.length; i++) {
            groupItems.push(<ListGroupItem style={{width:'60%', fontSize:24, letterSpacing:1.5,  margin:'auto', marginBottom:20}}>
                <Badge className="single-own-portfolio-inlist-badge"> {this.getName(this.state.trEqs[i].sym)} ({this.state.trEqs[i].sym})</Badge>
            </ListGroupItem>)
        }
        return (
            <div style={{textAlign:'center'}}className="single-portfolio-outer-div">
                <Badge style={{ marginBottom: 30, borderBottom: '1px groove white', paddingBottom: 10 }}>
                    <h1 className="single-own-portfolio-header">
                        {this.state.name}
                        <FollowPortfolioButton othersId={this.props.match.params.othersId} pk={this.props.match.params.pk} />
    
                    </h1>
                </Badge>
                <Badge
                    style={{
                        color:'white',
                        marginBottom: 30, marginTop: 50, fontSize: 30,
                        borderBottom: '1px groove white', paddingBottom: 10
                    }}
                    >Equipments</Badge>
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
                headers: { Authorization: `Token ${token}` }
            }).then(res => {
                for (var i = 0; i < res.data.tr_eqs.length; i++) {
                    trEqs.push(res.data.tr_eqs[i]);
                }
                this.setState({ name: res.data.name })
                this.setState({ trEqs: trEqs });
                this.setState({ owner: res.data.owner })
            }
            );
    }
}

export default OthersSinglePortfolioPage;
