import React, { Component } from "react";
import { Button } from "react-bootstrap";
import TraderNavBar from "./traderNavbar";
class FollowItem extends Component {
  state = {};
  render() {
    return (
      <Button variant="outline-danger">/*{this.props.follows.userName}*/</Button>
    );
  }
}

export default FollowItem;

/*{this.state.users.map(users => (
  <FollowItem key={users.id} users={users}></FollowItem>
))}*/