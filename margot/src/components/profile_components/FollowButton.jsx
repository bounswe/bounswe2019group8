import React, { Component } from "react";
import {Route} from "react-router-dom";
import "./ProfileArea.css";
import axios from "axios";
import { Button, Card, ListGroup } from "react-bootstrap";

class FollowButton extends Component {
  state = {
    api: axios.create({
    baseURL: "http://8.209.81.242:8000/"
  }),
    isFollowed : false
    };
 componentDidMount(){
  var tempList=[]
    tempList = JSON.parse(localStorage.getItem("followings"))
    tempList.forEach((element)=>{
        if (String(element) === this.props.userId){
            this.setState({isFollowed:true})
        }
      });
  }
  
    follow =()=> {
      var tempList=[]
      this.state.api
      .post(
        "users/"+localStorage.getItem("userId")+"/followings",
        {
          following_pk: parseInt(this.props.userId)
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("userToken")}`
          }
        }
      )
      .then(response => {
        axios
        .get("http://8.209.81.242:8000/users/"+localStorage.getItem("userId")+"/followings", {
          headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
        })
        .then(res => {
          res.data.forEach((element)=>{
            tempList.push(element.pk)
          });
          localStorage.setItem("followings",JSON.stringify(tempList)) 
        });
        this.setState({isFollowed:true});
        
       });
  }
  unfollow=()=> {
    var tempList=[]
    this.state.api
      .delete(`users/${localStorage.getItem("userId")}/followings/${this.props.userId}`, {
        headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
      })
      .then(response => {
        axios
        .get("http://8.209.81.242:8000/users/"+localStorage.getItem("userId")+"/followings", {
          headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
        })
        .then(res => {
          res.data.forEach((element)=>{
            tempList.push(element.pk)
          });
          localStorage.setItem("followings",JSON.stringify(tempList)) 
        });
        this.setState({isFollowed:false});
      });
     
  }
  render() {
    if(this.state.isFollowed){
        return(
            <React.Fragment>
            <button
                      id="loginStyles"
                      class="myButton"
                      onClick={() => this.unfollow()}
                      //variant="outline-success"
                    >
                      Unfollow
                    </button>
            </React.Fragment>
            )
    }
    else{
       return( 
       <React.Fragment>
        <button
                  id="loginStyles"
                  class="myButton"
                  onClick={() => this.follow()}
                  //variant="outline-success"
                >
                  Follow
        </button>
        </React.Fragment>)
        
    }
  
  }
}
export default FollowButton;
