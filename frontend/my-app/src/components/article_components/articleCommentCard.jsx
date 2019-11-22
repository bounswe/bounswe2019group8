import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import "./articleCommentCard.css";
class ArticleCommentCard extends Component {
  state = {};
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
}

export default ArticleCommentCard;
