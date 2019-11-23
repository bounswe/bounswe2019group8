import React, { Component } from 'react';
import { Card, Button } from "react-bootstrap";
import "./tradingEqCommentCard.css";
import axios from "axios";
class TradingEqCommentCard extends Component {
    state = { 
        authorName: ""
     }
    render() { 
        return ( 
            <div className="my-hey-div">
            <Card className="comment-card">
                <Card.Body>
          <Card.Text>{this.props.commentContent}</Card.Text>
          <Button href={"/profile/" + this.props.articleAuthorId}>
            by {this.state.authorName}
          </Button>
        </Card.Body>
      </Card>
            </div>
         );
    }
    componentWillMount(){
    var token = localStorage.getItem("userToken");
    var id = this.props.articleAuthorId;
        axios
    .get("http://8.209.81.242:8000/users/" + id, {
      headers: { Authorization: `Token ${token}` }
    })
    .then(res => {
        var authorName = res.data.first_name + " " + res.data.last_name;
      this.setState({authorName: authorName});
    });
    }
}
 
export default TradingEqCommentCard;