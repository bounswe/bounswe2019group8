import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import "./articleCard.css";
import axios from "axios";

class ArticleCard extends Component {
  state = {
    articleTitle: "",
    articleContent: "",
    articleRate: 0,
    articlePk: -1,
    articleAuthorId: -1
  };
  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Title>{this.props.articleTitle}</Card.Title>
          <Card.Text>{this.state.articleContent}</Card.Text>
          <Button className="btn-primary user-name">
            by {this.state.articleAuthorId}
          </Button>
          <Button variant="primary">Read the article</Button>
        </Card.Body>
      </Card>
    );
  }
  componentDidMount() {
    var myContent =
      this.props.articleContent[0] +
      this.props.articleContent[1] +
      this.props.articleContent[2] +
      this.props.articleContent[3] +
      this.props.articleContent[4] +
      this.props.articleContent[5] +
      this.props.articleContent[6] +
      this.props.articleContent[7] +
      this.props.articleContent[8] +
      this.props.articleContent[9] +
      this.props.articleContent[10] +
      this.props.articleContent[11];
    this.setState({ articleContent: myContent });
    var token = localStorage.getItem("userToken");
    axios
      .get("http://8.209.81.242:8000/users/" + this.props.articleAuthorId, {
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        console.log(res);
        this.setState({
          articleAuthorId: res.data.first_name + " " + res.data.last_name
        });
      });
  }
}

export default ArticleCard;
