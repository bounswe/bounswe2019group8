import React, { Component } from 'react';
import "./singleOwnPortfolioPage.css";
import axios from "axios";
import { ListGroup, ListGroupItem, Badge } from "react-bootstrap";
import FollowPortfolioButton from "./followPortfolioButton";

import { MdDoNotDisturbOn } from 'react-icons/md'
class OthersSinglePortfolioPage extends Component {
    state = {
        trEqs: [],
        name: "",
        owner: '',
        yesNo: true,
        ownerName: ""
    }

    getName(sym) {
        const tradingEquipments = JSON.parse(localStorage.getItem("equipmentList"));

        return tradingEquipments.find(trEq => (trEq.sym === sym)).name;
    }

    render() {
        var groupItems = [];
        for (var i = 0; i < this.state.trEqs.length; i++) {
            groupItems.push(<ListGroupItem className='listGroup' style={{ width: '60%', fontSize: 24, letterSpacing: 1.5, margin: 'auto', marginBottom: 20 }}>
                <Badge className="single-own-portfolio-inlist-badge"> {this.getName(this.state.trEqs[i].sym)} ({this.state.trEqs[i].sym})</Badge>
            </ListGroupItem>)
        }
        console.log(this.state.ownerName);
        return (
            <div style={{ textAlign: 'center' }} className="single-portfolio-outer-div">
              <div className="single-own-portfolio-headers">
                <Badge style={{ marginBottom: 30, fontSize: 24, borderBottom: '1px groove white', paddingBottom: 10 }}>
                    <div style={{ color: 'white', fontWeight: 'lighter', letterSpacing: 5 }}
                        className="single-own-portfolio-header">
                        {this.state.name.toUpperCase()}
                    </div>
                </Badge>
                <Badge style={{ marginBottom: 30, fontSize: 18, borderBottom: '1px groove white', paddingBottom: 10 }}>
                    <div style={{ color: 'white', fontWeight: 'lighter', letterSpacing: 5 }}
                        className="single-own-portfolio-header">
                        {this.state.ownerName.toUpperCase()}
                    </div>
                </Badge>
                </div> 
                <FollowPortfolioButton othersId={this.props.match.params.othersId} pk={this.props.match.params.pk} />

                <div style={{
                    color: 'white', fontWeight: 'lighter',
                    marginBottom: 30, marginTop: 50, fontSize: 20,
                    borderBottom: '1px groove white', paddingBottom: 10
                }}
                    className="single-own-portfolio-header">Equipments</div>
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
                this.setState({ name: res.data.name });
                this.setState({ trEqs: trEqs });
                this.setState({ owner: res.data.owner });
                axios
                    .get("http://8.209.81.242:8000/users/" + res.data.owner,  {
                        headers: { Authorization: `Token ${token}` }
                    }).then(result => {
                        this.setState({ownerName: result.data.first_name + " " + result.data.last_name});
                    })
            }
            );
    }
}

export default OthersSinglePortfolioPage;
