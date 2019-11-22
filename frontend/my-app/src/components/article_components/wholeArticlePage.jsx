import React, { Component } from "react";
import { Jumbotron, Button } from "react-bootstrap";
import axios from "axios";
import ArticleMakeComment from "./article_make_comment";
import "./wholeArticlePage.css";
import ArticleLikeButton from "./articleLikeButton";
import ArticleDislikeButton from "./articleDislikeButton";
import {withRouter} from "react-router-dom";

class WholeArticlePage extends Component {
  state = {
    articleTitle: "",
    articleContent: "",
    authorId: -1,
    authorName: "",
    articlePk:""
  };
  render() {
    return (
      <div className="my-div">
        <Jumbotron>
          <h1>{this.state.articleTitle}</h1>
          <p>{this.state.articleContent}</p>
          <p>
            <Button variant="primary">by {this.state.authorName}</Button>
          </p>
        </Jumbotron>
        <ArticleMakeComment />
        <ArticleLikeButton />
        <ArticleDislikeButton />
      </div>
    );
  }
  componentDidMount() {
    var token = localStorage.getItem("userToken");
    this.setState({articlePk:this.props.match.params.id})
    axios
      .get("http://8.209.81.242:8000/articles/" + this.props.match.params.id, {
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        console.log(res.data);
        this.setState({ articleTitle: res.data.title });
        this.setState({ articleContent: res.data.content });
        this.setState({ authorId: res.data.author });
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
}

export default WholeArticlePage;
