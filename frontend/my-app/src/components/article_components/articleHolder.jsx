import React, { Component } from "react";
import ArticleCard from "./articleCard";
import "./articleHolder.css";
import { Button } from "react-bootstrap";
import axios from "axios";

class ArticleHolder extends Component {
  state = {
    finalList:[],
    articles: [],
    gridOfArticles: [],
    count: 0
  };
  render() {
      return (
        <React.Fragment>
          <div className="container">
            <Button
              href="/articlewrite"
              className="write-article"
              onClick={this.postArticle}
            >
              Write an article
            </Button>
            <div className="article-card-container">{this.state.finalList}</div>
          </div>
        </React.Fragment>
      );
  }
   componentWillMount () {
    axios
    .get("http://8.209.81.242:8000/articles").then(res => {
      var articleList2 = res.data;
      localStorage.setItem("articleList", JSON.stringify(articleList2));
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
      this.setState({finalList:finalList})
    }
    
    );
   
  }
}

export default ArticleHolder;
