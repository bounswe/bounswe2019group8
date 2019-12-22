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
    for (var i = 0; i < articleList.length; i++) {
      finalList.push(
        <ArticleCommentCard
          style={{width:'70%'}}
          commentPk = {articleList[i].pk}        
          commentContent={articleList[i].content}
          articleAuthorId={articleList[i].author}
        />
      );
      finalList=finalList.reverse();
    }
    return (
      <React.Fragment>
        <div className="outer-div" style={{padding:12}} >
          <div className="article-comment-container">
            <Badge className="comments-badge">Comments:</Badge>
            <div className="my-outer-div">{finalList}</div>
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
