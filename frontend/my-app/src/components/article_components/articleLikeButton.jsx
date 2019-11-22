import React, { Component } from "react";
import { Card, Badge } from "react-bootstrap";
import "./articleLikeButton.css";

class ArticleLikeButton extends Component {
  state = {};
  render() {
    return (
      <div>
        <img src={require("../images/omgLike.jpg")} height="50" weight="70" />
      </div>
    );
  }
}

export default ArticleLikeButton;
