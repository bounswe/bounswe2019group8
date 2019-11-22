import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import "./articleCommentCard.css";
import axios from "axios";

class ArticleCommentCard extends Component {
  state = {
    authorName: ""
  };
  render() {
    return (
      <Card className="comment-card">
        <Card.Body>
          <Card.Text>{this.props.commentContent}</Card.Text>
          <Button href={"/profile/" + this.props.articleAuthorId}>
            by {this.props.articleAuthorId}
          </Button>
        </Card.Body>
      </Card>
    );
  }
  componentWillMount() {}
}

export default ArticleCommentCard;
