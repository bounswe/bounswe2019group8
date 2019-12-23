import React, { Component } from 'react';
import {Button} from "react-bootstrap";
import "./removeTrEqButton.css";
import axios from "axios";

import {MdDelete} from 'react-icons/md'

class RemoveTrEqButton extends Component {
    state = { 
        hello: true
     }
    render() { 
        return ( 
            <div style={{float:'right'}}>
                <Button action href ={"/profile/" + localStorage.getItem("userId") +"/portfolio/" + this.props.pk} 
                onClick={() => this.handleRemove()} className="trEq-remove-btn"><MdDelete></MdDelete></Button>
            </div>
         );
    }
    componentWillMount(){
        this.setState({hello: !this.state.hello});
    }
    handleRemove = () => {
        var stringToSend="[";
        var eqJson = this.props.trEqs;
        var val = this.props.sym;
        for(var i = 0; i < eqJson.length; i++){
            if(eqJson[i].sym == val){
                eqJson.splice(i, 1);
            }
        }
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
        var userId = localStorage.getItem("userId");
        var token = localStorage.getItem("userToken");
        axios
        .put("http://8.209.81.242:8000/users/" + userId + "/portfolios/" + this.props.pk, data,{
        headers: { Authorization: `Token ${token}` }
        }).then(response => {
        });
        this.setState({hello: !this.state.hello});
        this.componentWillMount();
    }
}
 
export default RemoveTrEqButton;