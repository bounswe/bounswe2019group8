import React, { Component } from "react";
import { Badge } from "react-bootstrap";
import axios from "axios";
import ArticleCommentCard from "./articleCommentCard";
import "./articleCommentHolder2.css";
import {withRouter} from "react-router-dom"
import ParityMakeComment from "./parity_make_comment";
class ArticleCommentHolder2 extends Component {
  render() {
    let articleList = this.props.comments;
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
      finalList = finalList.reverse();
    }
    return (
      <React.Fragment>
        <div className="outer-div" >
          <div className="article-comment-container">

            <Badge className="comments-badge">Comments:</Badge>
            <div className="my-outer-div">{finalList}</div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(ArticleCommentHolder2);
