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
    if (this.state.count === 1) {
      this.componentDidMount();
    }

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
          <Button className="write-article" onClick={this.postArticle}>
            Write an article
          </Button>
          <div className="card-container">{finalList}</div>
        </div>
      </React.Fragment>
    );
  }
  componentDidMount() {
    this.setState({ count: this.state.count + 1 });
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
        console.log(articleList);
        console.log(JSON.stringify(articleList));
        localStorage.setItem("articleList", JSON.stringify(articleList));
        //this.setState({ gridOfArticles: articleCardList });
        console.log(localStorage.getItem("articleList"));
      });
    //const listItems = this.state.gridOfArticles.map(line => <li>{line}</li>);
  }

}

export default ArticleHolder;
