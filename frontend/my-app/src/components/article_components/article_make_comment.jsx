import React, { Component } from "react";
import {
  FormGroup,
  FormControl,
  FormLabel,
  Button,
  Badge
} from "react-bootstrap";
import "./article_make_comment.css";
import axios from "axios";
import {withRouter} from "react-router-dom";
class ArticleMakeComment extends Component {
  constructor() {
    super();
    this.state = {
      comment: ""
    };
  }

  changeHandler = event => {
    this.setState({
      comment: event.target.value
    });
  };
  handleSubmit = event => {
    event.preventDefault();

    var token = localStorage.getItem("userToken");
    var data = {
      content: this.state.comment
    };
    axios
      .post(
        "http://8.209.81.242:8000/articles/" +
          this.props.articlePk +
          "/comments",
        data,
        {
          headers: { Authorization: `Token ${token}` }
        }
      )
      .then(function(response) {});
      this.props.history.push("/followers" ); 
      this.props.history.push("/articles/" + this.props.articlePk);
    
      this.props.history.push("/articles/" + this.props.articlePk);
  };
  render() {
    return (
      <div>
        <div className="my-form">
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="title" size="large">
              <FormLabel>
                <Badge className="comment-badge">Leave a comment:</Badge>
              </FormLabel>
              <FormControl
                autoFocus
                type="comment"
                value={this.state.comment}
                onChange={this.changeHandler}
              />
            </FormGroup>
            <Button
            
              className="submit-comment-btn"
              block
              type="submit"
              size="large"
            >
              Submit Comment
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(ArticleMakeComment);
