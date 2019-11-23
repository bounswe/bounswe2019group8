import React, { Component } from "react";
import "../article_components/articleHolder.css";
import { Button } from "react-bootstrap";
import axios from "axios";
import {withRouter} from "react-router-dom";
import ArticleCard from "../article_components/articleCard";

class OthersArticles extends Component {
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
          console.log(toString(articleList[i].author))
          console.log(this.props.match.params.id)
        if(this.props.match.params.id === articleList[i].author.toString()){
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
     
      }
      this.setState({finalList:finalList})
    }
    );
  }
}

export default withRouter(OthersArticles);
