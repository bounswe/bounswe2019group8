import React, { Component } from "react";
import { Badge } from "react-bootstrap";
import axios from "axios";
import ArticleCommentCard from "./articleCommentCard";
import "./articleCommentHolder.css";
import {withRouter} from "react-router-dom"
class ArticleCommentHolder extends Component {
  state = {
    comments: []
  };
  render() {
    let articleList = this.state.comments;
    let finalList = [];
    this.componentWillMount();
    for (var i = 0; i < articleList.length; i++) {
      finalList.push(
        <ArticleCommentCard
          commentContent={articleList[i].content}
          articleAuthorId={articleList[i].author}
        />
      );
    }
    return (
      <React.Fragment>
        <div className="outer-div">
          <div className="article-comment-container">
            <Badge className="comments-badge">Comments:</Badge>
            <div className="outer-div">{finalList}</div>
          </div>
        </div>
      </React.Fragment>
    );
  }
  componentWillMount() {
    var token = localStorage.getItem("userToken");
    var commentList = [];
    axios
      .get(
        "http://8.209.81.242:8000/articles/" +
          this.props.articlePk +
          "/comments",
        { headers: { Authorization: `Token ${token}` } }
      )
      .then(res => {
        for (var i = 0; i < res.data.length; i++) {
          commentList.push(res.data[i]);
        }
        this.setState({ comments: commentList });
        console.log(this.state.comments);
      });

    console.log(this.props.articlePk);
  }
}

export default withRouter(ArticleCommentHolder);
