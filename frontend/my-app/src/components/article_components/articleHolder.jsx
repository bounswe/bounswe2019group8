import React, { Component } from "react";
import ArticleLine from "./articleLine";
import "./articleHolder.css";
import { Button } from "react-bootstrap";
import axios from "axios";

class ArticleHolder extends Component {
  state = {
    articles: []
  };
  render() {
    return (
      <div>
        <Button className="write-article" onClick={this.postArticle}>
          Write an article
        </Button>
        <div>
          <ArticleLine />
          <ArticleLine />
          <ArticleLine />
        </div>
      </div>
    );
  }
  componentDidMount() {
    var token = localStorage.getItem("userToken");
    axios
      .get("http://8.209.81.242:8000/articles", {
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        //this.setState({ articles: res.data });
        //console.log(res);
      });
  }
}

export default ArticleHolder;
