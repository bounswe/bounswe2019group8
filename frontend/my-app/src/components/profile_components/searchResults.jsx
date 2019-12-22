import React, { Component } from "react";
import { Button, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import axios from "axios";
import {withRouter} from "react-router-dom";
import TrEqSearchHandler from "./trEqSearchHandler";
import UserSearchHandler from "./userSearchHandler";
import ArticleSemanticHandler from "./articleSemanticHandler";
import CommentSemanticHandler from "./commentSemanticHandler";

class SearchResults extends Component {
  state = {
      trEqList: [],
      userList: [],
      articleSemanticList : [],
      commentSemanticList : [],
      annotationSemanticList: []
  };

  componentWillMount(){
    var data = {
      search_text: this.props.match.params.search
    };
    var user_id = localStorage.getItem("userId");
    var token = localStorage.getItem("userToken");
    axios
      .get("http://8.209.81.242:8000/semantic_search?keyword=" + data.search_text + "&type=article",{
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        this.setState({articleSemanticList: res.data});
        console.log(this.state.articleSemanticList);
      });
      axios
      .get("http://8.209.81.242:8000/semantic_search?keyword=" + data.search_text + "&type=annotation",{
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        this.setState({annotationSemanticList: res.data});
        console.log(this.state.annotationSemanticList);
      });
      axios
      .get("http://8.209.81.242:8000/semantic_search?keyword=" + data.search_text + "&type=comment",{
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        this.setState({commentSemanticList: res.data});
        console.log(this.state.commentSemanticList);
      });
      axios
      .post("http://8.209.81.242:8000/trading_equipment_searches", data, {
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        this.setState({trEqList: res.data});
        console.log(this.state.trEqList);
      });
      axios
      .post("http://8.209.81.242:8000/user_searches", data, {
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        this.setState({userList: res.data});
        console.log(this.state.userList);
      });
  }
  render() {
    var trEqListItems = [];
    var userListItems = [];
    var articleListItems = [];
    var commentListItems = [];
    var annotationListItems = [];

    console.log("i get clalled")
    for(var i = 0; i < this.state.trEqList.length; i++){
    trEqListItems.push(<TrEqSearchHandler result={this.state.trEqList[i]}></TrEqSearchHandler>);
    //trEqListItems.push(<ListGroupItem>{i}</ListGroupItem>)
    }
    for(var i = 0; i < this.state.userList.length; i++){
      userListItems.push(<UserSearchHandler result={this.state.userList[i]}></UserSearchHandler>)
    }
    for(var i = 0; i < this.state.articleSemanticList.length; i++){
      articleListItems.push(<ArticleSemanticHandler result={this.state.articleSemanticList[i]}></ArticleSemanticHandler>)
    }
    for(var i = 0; i < this.state.commentSemanticList.length; i++){
      commentListItems.push(<CommentSemanticHandler result={this.state.commentSemanticList[i]}></CommentSemanticHandler>)
    }

    return(
    <React.Fragment>
       <Card style={{ width: "36rem", align: "center" }}>
       {console.log(this.state.followings)}
          <ListGroup className="list-group-flush">
          <ListGroup.Item>
             Results :
              <ListGroup className="list-group-flush">
                {trEqListItems}
                {userListItems}
                {articleListItems}
                {commentListItems}
              </ListGroup>
            </ListGroup.Item>     
          </ListGroup>
       
        </Card>
    </React.Fragment>
    )
    return(
      <div>
        hello
      </div>
    )
  }

}
export default withRouter(SearchResults);
