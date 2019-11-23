import React, { Component } from "react";
import { Jumbotron, Button } from "react-bootstrap";
import axios from "axios";
import ArticleMakeComment from "./article_make_comment";
import ArticleCommentHolder from "./articleCommentHolder";
import "./wholeArticlePage.css";
import ArticleLikeButton from "./articleLikeButton";
import ArticleDislikeButton from "./articleDislikeButton";
import { withRouter } from "react-router-dom";
import ArticleLike from "./articleLike";

class WholeArticlePage extends Component {
  state = {
    articleTitle: "",
    articleContent: "",
    authorId: -1,
    authorName: "",
    articlePk: "",
    articleRanking :0
  };
  render() {
    return (
      <div>
        <div className="first-div">
          <Jumbotron className="my-jumbotron">
            <h1 className="article-header">{this.state.articleTitle}</h1>
            <p className="my-par">{this.state.articleContent}</p>
            <p>
              <Button
                href={"/profile/" + this.state.authorId}
                variant="primary"
                className="by-author-button"
              >
                by {this.state.authorName}
              
              </Button>
              <ArticleLike articlePk = {this.state.articlePk}/>
              <h2> Rating: {this.state.articleRanking} </h2>  
            </p>
          </Jumbotron>
        </div>
        <div className="second-div">
          <ArticleMakeComment refresh={this.refreshPage} articlePk={this.state.articlePk} />
        </div>
        <div className="third-div">
          <ArticleCommentHolder articlePk={this.state.articlePk} />
        </div>
      </div>
    );
  }
  componentWillMount() {
    var token = localStorage.getItem("userToken");
    this.setState({ articlePk: this.props.match.params.id });
    axios
      .get("http://8.209.81.242:8000/articles/" + this.props.match.params.id, {
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        this.setState({ articleTitle: res.data.title });
        this.setState({ articleContent: res.data.content });
        this.setState({ authorId: res.data.author });
        this.setState({articleRanking: res.data.rating})
        axios
          .get("http://8.209.81.242:8000/users/" + res.data.author, {
            headers: { Authorization: `Token ${token}` }
          })
          .then(result => {
            this.setState({
              authorName: result.data.first_name + " " + result.data.last_name
            });
          });
      });
  }
  refreshPage =() =>{
    window.location.reload();
  }
}

export default WholeArticlePage;
