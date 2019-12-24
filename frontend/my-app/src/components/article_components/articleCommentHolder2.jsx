import React, { Component } from "react";
import { Badge } from "react-bootstrap";
import axios from "axios";
import ArticleCommentCard from "./articleCommentCard";
import "./articleCommentHolder2.css";
import {withRouter} from "react-router-dom"
import ParityMakeComment from "./parity_make_comment";
class ArticleCommentHolder2 extends Component {
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
      finalList = finalList.reverse();
    }
    return (
      <React.Fragment>
        <div  className="outer-div" >
          <div className="article-comment-container">
          
            <Badge style={{color:'white',borderBottom:'1px groove white',
            borderRadius:0, fontSize:28, letterSpacing:4, fontWeight:'lighter'}}
             className="comments-badge">Comments:</Badge>
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
        "http://8.209.81.242:8000/trading_equipments/" +
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

export default withRouter(ArticleCommentHolder2);
