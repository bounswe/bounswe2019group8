import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import UpVote from "./upvote"
import DownVote from "./downvote"
import { FaVoteYea } from "react-icons/fa";

class VoteHolder extends Component {
  state = {
    authorName: "",
    likeState: 0,
    rating: 0
  };
  render() {
    return (
      
        <div>
          
          <div style={{float:'right'}}>
          {this.state.rating}
          { this.state.rating>=0
        ?  <FaVoteYea style={{ color: 'green', marginRight: 4 }}></FaVoteYea>
        :  <FaVoteYea style={{ color: 'red', marginRight: 4 }}></FaVoteYea>
      }
         
          
            <UpVote incRating={this.incRating} decRating={this.decRating} makeLike={this.makeLike}
              makeNeutral={this.makeNeutral} likeState={this.state.likeState} commentPk={this.props.commentPk} />
            <DownVote incRating={this.incRating} decRating={this.decRating} makeDisslike={this.makeDisslike}
              makeNeutral={this.makeNeutral} likeState={this.state.likeState} commentPk={this.props.commentPk} />
          </div>
        </div>

        
    );
  }
  makeLike = () => {
    this.setState({ likeState: 1 })
  }
  makeDisslike = () => {
    this.setState({ likeState: 2 })
  }
  makeNeutral = () => {
    this.setState({ likeState: 0 })
  }
  incRating = () => {
    var newRating = this.state.rating + 1;
    this.setState({ rating: newRating })
  }
  decRating = () => {
    var newRating = this.state.rating - 1;
    this.setState({ rating: newRating })
  }
}

export default VoteHolder;