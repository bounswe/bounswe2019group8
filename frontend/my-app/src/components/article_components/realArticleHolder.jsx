import React, { Component } from "react";
import ArticleLine from "./articleLine";
import "./articleHolder.css";
import { Button } from "react-bootstrap";
import axios from "axios";
import ArticleHolder from "./articleHolder";

class RealArticleHolder extends Component {
  state = {
    articles: [],
    gridOfArticles: [],
    count: 0
  };
  componentWillMount() {
    //const listItems = this.state.gridOfArticles.map(line => <li>{line}</li>);
  }
  render() {
    return (
      <React.Fragment >
        <ArticleHolder articles={this.state.articles} />
      </React.Fragment>
    );
  }
}

export default RealArticleHolder;
