import React, { Component } from "react";
import { Jumbotron, Button } from "react-bootstrap";
import axios from "axios";

class WholeArticlePage extends Component {
  state = {
    articleTitle: "",
    articleContent: "",
    authorId: -1,
    authorName: ""
  };
  render() {
    return (
      <div>
        <Jumbotron>
          <h1>{this.state.articleTitle}</h1>
          <p>{this.state.articleContent}</p>
          <p>
            <Button variant="primary">by {this.state.authorName}</Button>
          </p>
        </Jumbotron>
      </div>
    );
  }
  componentDidMount() {
    var token = localStorage.getItem("userToken");
    axios
      .get("http://8.209.81.242:8000/articles/5", {
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        console.log(res.data);
        this.setState({ articleTitle: res.data.title });
        this.setState({ articleContent: res.data.content });
        this.setState({ authorId: res.data.author });
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
}

export default WholeArticlePage;
