import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import "./articleCard.css";
class ArticleCard extends Component {
  state = {
    cardTitle: "",
    cardText: ""
  };
  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          <Button className="btn-primary user-name">by User Name</Button>
          <Button variant="primary">Read the article</Button>
        </Card.Body>
      </Card>
    );
  }
}

export default ArticleCard;
