import React, { Component } from "react";
import ArticleCard from "../articleCard";
import "./reArticleHolder.css";
import { Button } from "react-bootstrap";
import axios from "axios";

class ReArticleHolder extends Component {
  state = {
    articles: [],
    gridOfArticles: []
  };
  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="card-container">{this.state.gridOfArticles}</div>
        </div>
      </React.Fragment>
    );
  }
  componentDidMount() {
    var token = localStorage.getItem("userToken");
    console.log(token);
    axios
      .get("http://8.209.81.242:8000/articles", {
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        this.setState({ articles: res.data });
        var count = -1;
        var articleList = res.data;
        let articleCardList = [];
        for (var i = 0; i < articleList.length; i++) {
          articleCardList.push(
            <ArticleCard
              articleContent={articleList[i].content}
              articleAuthorId={articleList[i].author}
              articleTitle={articleList[i].title}
              articlePk={articleList[i].pk}
              articleRate={articleList[i].rating}
            />
          );
        }
        this.setState({ gridOfArticles: articleCardList });
        console.log(this.state.gridOfArticles);
      });
    //const listItems = this.state.gridOfArticles.map(line => <li>{line}</li>);
  }
}

export default ReArticleHolder;
