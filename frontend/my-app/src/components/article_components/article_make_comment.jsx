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
     this.props.refresh()
  };
  render() {
    return (
      <div>
        <div className="my-article-form">
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="title" size="large">
              <FormLabel>
                <Badge id="comment-badge">Leave a comment:</Badge>
              </FormLabel>
              <FormControl
                style={{minHeight:100}}
                autoFocus
                type="content"
                as="textarea"
                rows="4"
                cols="80"
                value={this.state.comment}
                onChange={this.changeHandler}
              />
            </FormGroup>
            <Button
              style={{backgroundColor: 'rgb(208, 217, 223)'}}
              id="submit-comment-btn"
              block
              type="submit"
              size="sm"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(ArticleMakeComment);
