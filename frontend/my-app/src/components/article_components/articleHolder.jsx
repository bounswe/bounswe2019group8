import React, { Component } from "react";
import ArticleCard from "./articleCard";
import "./articleHolder.css";
import { Button } from "react-bootstrap";
import axios from "axios";

class ArticleHolder extends Component {
  state = {
    articles: [],
    gridOfArticles: [],
    count: 0
  };
  render() {
    let articleList = JSON.parse(localStorage.getItem("articleList"));
    let finalList = [];
    for (var i = 0; i < articleList.length; i++) {
      finalList.push(
        <ArticleCard
          articleContent={articleList[i].content}
          articleAuthorId={articleList[i].author}
          articleTitle={articleList[i].title}
          articlePk={articleList[i].pk}
          articleRate={articleList[i].rating}
        />
      );
    }
    return (
      <React.Fragment>
        <div className="container">
          <Button href="/articlewrite" className="write-article" onClick={this.postArticle}>
            Write an article
          </Button>
          <div className="card-container">{finalList}</div>
        </div>
      </React.Fragment>
    );
  }
  componentDidMount() {
    //this.setState({ count: this.state.count + 1 });
    console.log("articleHolder");
    //const listItems = this.state.gridOfArticles.map(line => <li>{line}</li>);
  }
}

export default ArticleHolder;
