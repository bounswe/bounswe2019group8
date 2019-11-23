import React, { Component } from 'react';
import {
    FormGroup,
    FormControl,
    FormLabel,
    Button,
    Badge
  } from "react-bootstrap";
  import "./tradingEqMakeComment.css";
class TradingEqMakeComment extends Component {
    state = {  }
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
 
export default TradingEqMakeComment;