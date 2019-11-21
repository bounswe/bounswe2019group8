import React, { Component } from "react";
import { Button, Badge } from "react-bootstrap";
import "./article_make_comment.css";
class ArticleMakeComment extends Component {
  constructor() {
    super();
    this.state = {
      comment: ""
    };
  }

  changeHandler = event => {
    this.setState({
      email: event.target.value
    });
  };
  handleSubmit = event => {
    /* event.preventDefault();

    setIsLoading(true);
    var token = localStorage.getItem("userToken");
    console.log(token);
    var data = {
      title: fields.title,
      content: fields.content
    };
    axios
      .post("http://8.209.81.242:8000/articles", data, {
        headers: { Authorization: `Token ${token}` }
      })
      .then(function(response) {
        console.log(response);
      });*/
  };
  render() {
    return (
      <div>
        <div>
          <Badge>Leave a comment</Badge>
        </div>
        <form className="my-form">
          <input
            className="my-form"
            type="comment"
            name="comment"
            value={this.state.email}
            onChange={this.changeHandler}
          />
        </form>
        <Button type="submit">Helloo</Button>
      </div>
    );
  }
}

export default ArticleMakeComment;
