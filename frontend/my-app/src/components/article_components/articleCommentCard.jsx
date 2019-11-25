import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import "./articleCommentCard.css";
import axios from "axios";
import CommentLike from "../joint_components/commentLike"
import CommentDislike from "../joint_components/commentDislike"
import { FaHeart } from "react-icons/fa";

class ArticleCommentCard extends Component {
  state = {
    authorName: "",
    likeState: 0,
    rating: 0
  };
  render() {
    return (
      <Card className="comment-card">
        <div>
          <FaHeart style={{ color: 'red', marginRight: 4 }}></FaHeart>
          {this.state.rating}
          <div style={{float:'right'}}>
            <CommentLike incRating={this.incRating} decRating={this.decRating} makeLike={this.makeLike}
              makeNeutral={this.makeNeutral} likeState={this.state.likeState} commentPk={this.props.commentPk} />
            <CommentDislike incRating={this.incRating} decRating={this.decRating} makeDisslike={this.makeDisslike}
              makeNeutral={this.makeNeutral} likeState={this.state.likeState} commentPk={this.props.commentPk} />
          </div>
        </div>

        <Card.Body>

          <Button id='commentBy' href={"/profile/" + this.props.articleAuthorId}>
            {this.state.authorName} says:
          </Button>


          <Card.Text style={{ fontSize: 13, padding: 20, maxWidth: 420 }}>{this.props.commentContent}</Card.Text>

        </Card.Body>
      </Card>
    );
  }
  componentWillMount() {
    var token = localStorage.getItem("userToken");
    var id = this.props.articleAuthorId;
    axios
      .get("http://8.209.81.242:8000/users/" + id, {
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        var authorName = res.data.first_name + " " + res.data.last_name;
        this.setState({ authorName: authorName });
      });
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

export default ArticleCommentCard;
