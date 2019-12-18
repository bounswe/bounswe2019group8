import React, { Component } from 'react';
import {Button} from "react-bootstrap";
import "./removeTrEqButton.css";
import axios from "axios";

class RemoveTrEqButton extends Component {
    state = { 
        hello: true
     }
    render() { 
        console.log(this.props.sym);
        return ( 
            <div className="trEq-remove-btn-div">
                <Button onClick={() => this.handleRemove()} className="trEq-remove-btn">Remove</Button>
            </div>
         );
    }
    componentWillMount(){
        this.setState({hello: !this.state.hello});
    }
    handleRemove = () => {
        var stringToSend="[";
        console.log("clicked bubba");
        console.log(this.props.trEqs);
        var eqJson = this.props.trEqs;
        var val = this.props.sym;
        for(var i = 0; i < eqJson.length; i++){
            if(eqJson[i].sym == val){
                eqJson.splice(i, 1);
            }
        }
        console.log(eqJson);
        for(var i = 0; i < eqJson.length; i++){
            if(i == eqJson.length-1){
                stringToSend += "{\"sym\":\"" + eqJson[i].sym + "\"}";
            }
            else{
                stringToSend += "{\"sym\":\"" + eqJson[i].sym + "\"},";
            }
        }
        stringToSend += "]";
        var data = {
            tr_eqs: JSON.parse(stringToSend)
        }
        console.log(data);
        var userId = localStorage.getItem("userId");
        var token = localStorage.getItem("userToken");
        axios
        .put("http://8.209.81.242:8000/users/" + userId + "/portfolios/" + this.props.pk, data,{
        headers: { Authorization: `Token ${token}` }
        }).then(response => {
            console.log(response);
        });
        this.setState({hello: !this.state.hello});
        this.componentWillMount();
    }
}
 
export default RemoveTrEqButton;