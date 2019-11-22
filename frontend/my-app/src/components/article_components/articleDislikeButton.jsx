import React, { Component } from "react";
import { Card, Badge } from "react-bootstrap";

class ArticleDislikeButton extends Component {
  state = {};
  render() {
    return (
      <img src={require("../images/omgDislike.png")} height="75" weight="70" />
    );
  }
}

export default ArticleDislikeButton;
