import React, { Component } from 'react';
import axios from "axios";
import { Button, ListGroup, ListGroupItem, Badge } from "react-bootstrap";
import "./singleOwnPortfolioPage.css";
import AddTreqModal from "./addTreqModal";
import RemoveTrEqButton from "./removeTrEqButton";
import { withRouter } from "react-router-dom";
import { MdDeleteSweep } from 'react-icons/md'
class SingleOwnPortfolioPage extends Component {
    state = {
        trEqs: [],
        name: "",
        yesNo: true
    }

    getName(sym) {
        const tradingEquipments = JSON.parse(localStorage.getItem("equipmentList"));

        return tradingEquipments.find(trEq => (trEq.sym === sym)).name;
    }

    render() {
        var groupItems = [];
        for (var i = 0; i < this.state.trEqs.length; i++) {
            groupItems.push(<ListGroupItem className='listGroup' style={{ width: '60%', fontSize: 24, letterSpacing: 1.5, margin: 'auto', marginBottom: 20 }}>
                <Badge className="single-own-portfolio-inlist-badge"> 
                {this.getName(this.state.trEqs[i].sym)} ({this.state.trEqs[i].sym})
                </Badge>
                <RemoveTrEqButton pk={this.props.match.params.pk} trEqs={this.state.trEqs} sym={this.state.trEqs[i].sym}></RemoveTrEqButton>
            </ListGroupItem>)
        }
        return (
            <div style={{ textAlign: 'center' }} className="single-portfolio-outer-div">
                <Badge style={{ marginBottom: 30, fontSize: 24, borderBottom: '1px groove white', paddingBottom: 10 }}>
                    <div style={{ color: 'white', fontWeight: 'lighter', letterSpacing: 5 }}
                        className="single-own-portfolio-header">{this.state.name.toUpperCase()}</div>
                </Badge>

                <AddTreqModal onAddTreqModal={() => this.justToReRender()}
                    pk={this.props.match.params.pk} name={this.state.name}
                    prevEqs={this.state.trEqs}></AddTreqModal>
                <Button style={{ width: 300, fontWeight: 'lighter', letterSpacing: 3, margin: 'auto' }}
                    action href={"/profile/" + localStorage.getItem("userId") + "/portfolio"}
                    onClick={() => this.handleDelete()} className="single-own-portfolio-delete-btn"
                    variant="danger">
                        <MdDeleteSweep style={{marginRight:5}}></MdDeleteSweep>DELETE PORTFOLIO
                        </Button>
                <div style={{
                    color:'white', fontWeight:'lighter',
                    marginBottom: 30, marginTop: 50, fontSize: 20,
                    borderBottom: '1px groove white', paddingBottom: 10
                }}
                    className="single-own-portfolio-header">Equipments</div>
                <ListGroup style={{ letterSpacing: '2' }}>
                    {groupItems}</ListGroup>
            </div>
        );
    }
    handleDelete = () => {
        var userId = localStorage.getItem("userId");
        var token = localStorage.getItem("userToken");
        axios
            .delete("http://8.209.81.242:8000/users/" + userId + "/portfolios/" + this.props.match.params.pk, {
                headers: { Authorization: `Token ${token}` }
            }).then(response => {
                console.log(response);
            });
    }
    justToReRender = () => {
        console.log("neden bro");
        this.componentDidMount();
        this.setState({ yesNo: !this.state.yesNo });
    }
    componentDidMount() {
        this.setState({ yesNo: !this.state.yesNo });
    }
    componentWillMount() {
        var userId = localStorage.getItem("userId");
        var token = localStorage.getItem("userToken");
        var trEqs = [];
        axios
            .get("http://8.209.81.242:8000/users/" + userId + "/portfolios/" + this.props.match.params.pk, {
                headers: { Authorization: `Token ${token}` }
            }).then(res => {
                for (var i = 0; i < res.data.tr_eqs.length; i++) {
                    trEqs.push(res.data.tr_eqs[i]);
                }
                this.setState({ name: res.data.name })
                this.setState({ trEqs: trEqs });
            }

            );


    }

}

export default withRouter(SingleOwnPortfolioPage);
