import React, { Component } from "react";
import { Button, Badge } from "react-bootstrap";
import "./parityBadge.css";
import axios from "axios";

class ParityBadge extends Component {
  state = {parityData: null};
  render() {
    return (
      <div>
        <Badge className="parity-badge">{this.props.name}</Badge>
      </div>
    );
  }
  componentWillMount(){
    var token = localStorage.getItem("userToken");
    var parityData = [];
    axios.get("http://8.209.81.242:8000/trading_equipments/" + this.props.parityPk + "/parities", {
      headers: { Authorization: `Token ${token}` }
    }).then(res => {
      var parityData = res.data;
      this.setState({parityData: parityData});
    });
  }
}

export default ParityBadge;
