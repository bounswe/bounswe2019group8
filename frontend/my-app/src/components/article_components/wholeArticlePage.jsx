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
import ArticleDislike from "./articleDislike";
import { FaHeart } from "react-icons/fa";
import { MdBookmarkBorder } from "react-icons/md";

class WholeArticlePage extends Component {
  state = {
    articleTitle: "",
    articleContent: "",
    authorId: -1,
    authorName: "",
    articlePk: "",
    articleRanking: 0,
    likeState: 0,
    rating: 0
  };
  render() {
    return (
      <div style={{ width: '90%', margin: 'auto', paddingLeft: 100, paddingRight: 100, paddingTop: 30 }}>

        <div id='articleContainer' style={{ width: '50%', float: 'left' }} className="first-div">
          <div style={{ display: 'inline' }}>
            <Button
              id='writtenBy'
              href={"/profile/" + this.state.authorId}
              variant="outline-primary"
              className="by-author-button"
            >
              Author: {this.state.authorName}
            </Button>

            <Button
              id='rating'
              variant="outline-primary"
            >
              <FaHeart style={{ color: 'white', marginRight: 4 }}></FaHeart>
              Rating: {this.state.rating}
            </Button>

          </div>
          <Jumbotron className="my-jumbotron" >
            <div style={{ float: 'left', marginLeft: 0, width: '100%' }} className="article-header">
              <MdBookmarkBorder style={{ color: 'darkblue', marginRight: 6 }}></MdBookmarkBorder>
              {this.state.articleTitle}
            </div>
            <p className="my-par" style={{ fontSize: 15 }}>{this.state.articleContent}</p>

          </Jumbotron>
          <p style={{float:'right'}}>
            <ArticleLike incRating={this.incRating} decRating={this.decRating} makeLike={this.makeLike} makeNeutral={this.makeNeutral} likeState={this.state.likeState} articlePk={this.state.articlePk} />
            <ArticleDislike incRating={this.incRating} decRating={this.decRating} makeDisslike={this.makeDisslike} makeNeutral={this.makeNeutral} likeState={this.state.likeState} articlePk={this.state.articlePk} />
          </p>
        </div>

        <div style={{ width: '45%', float: 'right' }}>
          <div id='commentContainer' style={{ backgroundColor: 'rgb(208, 217, 223)', overflow: 'scroll', maxHeight: 480, marginBottom: 16 }}>
            <ArticleCommentHolder articlePk={this.state.articlePk} />
          </div>
          <div id='makeCommentContainer' style={{ float:'left' }} >
            <ArticleMakeComment refresh={this.refreshPage} articlePk={this.state.articlePk} />
          </div>

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
        this.setState({ articleRanking: res.data.rating })
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
  refreshPage = () => {
    window.location.reload();
  }
  makeLike = () => {
    this.setState({ likeState: 1 })
  }
  makeDisslike = () => {
    this.setState({ likeState: 2 })
  }
  makeNeutral = () => {
    this.setState({ likeState: 0 })
  }
  incRating = () => {
    var newRating = this.state.rating + 1;
    this.setState({ rating: newRating })
  }
  decRating = () => {
    var newRating = this.state.rating - 1;
    this.setState({ rating: newRating })
  }
}

export default WholeArticlePage;
