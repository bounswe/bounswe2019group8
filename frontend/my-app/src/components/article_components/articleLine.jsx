import React, { Component } from "react";
import ArticleCard from "./articleCard";
class ArticleLine extends Component {
  state = {};
  render() {
    return (
      <div className="articleLine">
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
      </div>
    );
  }
}
export default ArticleLine;
