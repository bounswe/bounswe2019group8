import React, { Component } from "react";
import { Button } from "react-bootstrap";
class FollowItem extends Component {
  state = {};
  render() {
    return (
      <Button variant="outline-danger">{this.props.follows.userName}</Button>
    );
  }
}

export default FollowItem;
