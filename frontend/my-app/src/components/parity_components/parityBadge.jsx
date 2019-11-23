import React, { Component } from "react";
import { Button, Badge } from "react-bootstrap";
import "./parityBadge.css";
import axios from "axios";

class ParityBadge extends Component {
  state = {parityData: null};
  render() {
    return (
      <div>
        <Button href={"/treq/" + this.props.parityPk} className="parity-badge">{this.props.name}</Button>
      </div>
    );
  }
  componentWillMount(){
    
  }
}

export default ParityBadge;
