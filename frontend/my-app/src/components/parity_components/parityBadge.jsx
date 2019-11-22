import React, { Component } from "react";
import { Button, Badge } from "react-bootstrap";
import "./parityBadge.css";
class ParityBadge extends Component {
  state = {};
  render() {
    return (
      <div>
        <Badge className="parity-badge">{this.props.name}</Badge>
      </div>
    );
  }
}

export default ParityBadge;
