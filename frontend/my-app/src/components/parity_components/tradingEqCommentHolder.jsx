import React, { Component } from 'react';
import axios from "axios";
import CommentCard from "./tradingEqCommentCard";
import "./tradingEqCommentHolder.css";
import MakeComment from "./tradingEqMakeComment";
class TradingEqCommentHolder extends Component {
    state = { 
        comments: []
     }
    render() { 
        let commentList = this.state.comments;
        let finalList = [];
        for (var i = 0; i < commentList.length; i++) {
          finalList.push(
            <CommentCard
              commentPk = {commentList[i].pk}
              commentContent={commentList[i].content}
              articleAuthorId={commentList[i].author}
            />
          );
        }
        return (
            <div className="my-holder">
              <div >
                <MakeComment refresh={this.refreshPage} pk={this.props.pk}/>
             {finalList}
             </div>
            </div>
         );
    }
    componentWillMount() {
        var token = localStorage.getItem("userToken");
        var commentList = [];
        axios
          .get(
            "http://8.209.81.242:8000/trading_equipments/" +
              this.props.pk +
              "/comments",
            { headers: { Authorization: `Token ${token}` } }
          )
          .then(res => {
              console.log(res.data)
            for (var i = 0; i < res.data.length; i++) {
              commentList.push(res.data[i]);
            }
            this.setState({ comments: commentList });
            console.log(this.state.comments);
          });
      }
      refreshPage =() =>{
        window.location.reload();
      }
}
 
export default TradingEqCommentHolder;