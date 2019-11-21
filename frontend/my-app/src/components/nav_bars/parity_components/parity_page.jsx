import React, { Component } from "react";
import "./parity_page.css";
import Graph from "./graph";
import { Badge } from "react-bootstrap";
import ArticleHolder from "../article_components/articleHolder";
class ParityPage extends Component {
  state = {};
  render() {
    return (
      <div>
        <ArticleHolder />
      </div>
    );
  }
}

export default ParityPage;
