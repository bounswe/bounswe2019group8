import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import "./articleCard.css";
import axios from "axios";
import LoaderButton from '../../containers/LoaderButton'
import {FaFeatherAlt, FaRegNewspaper} from "react-icons/fa";
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
      <Card style={{ fontWeight: 'lighter' }}>
        <Card.Body>

          <Card.Title>{this.props.articleTitle}</Card.Title>
          <Button style={{fontWeight:'bolder', fontSize:11, height:30, width:'auto', marginBottom:16}} id='writtenBy' href={"/profile/" + this.props.articleAuthorId} variant="primary">
            <FaFeatherAlt style={{marginRight:4}}></FaFeatherAlt>by {this.state.articleAuthorId}
          </Button>
          <Card.Text id='cardContent' style={{  padding: 10 }}>{this.state.articleContent}</Card.Text>

          <Button id='articleCardButton' href={"/articles/" + this.props.articlePk} block variant="outline-primary">
            <FaRegNewspaper style={{marginRight:4}}></FaRegNewspaper>Read the article
          </Button>
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
        this.setState({
          articleAuthorId: res.data.first_name + " " + res.data.last_name
        });
      });
  }
}

export default ArticleCard;
