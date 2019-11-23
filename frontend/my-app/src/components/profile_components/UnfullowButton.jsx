import React, { Component } from "react";
import {Route} from "react-router-dom";
import "./ProfileArea.css";
import axios from "axios";
import { Button, Card, ListGroup } from "react-bootstrap";

class UnfollowButton extends Component {
  state = {
    api: axios.create({
    baseURL: "http://8.209.81.242:8000/"
  }),
    isFollowed : false
    };
 componentDidMount(){
    var following = JSON.parse(localStorage.getItem("followings"))
    following.forEach((element)=>{
        if (toString(element) === toString(this.props.id)){
            this.setState({isFollowed:true})
        }
      });
    
  }
  initializeFollowing = () =>{
   
  }
    follow() {
    this.state.api
      .post(
        `users/${localStorage.getItem("userId")}/followings`,
        {
          following_pk: this.props.id
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("userToken")}`
          }
        }
      )
      .then(response => {
       });
       axios
       .get("http://8.209.81.242:8000/users/"+localStorage.getItem("userId")+"/followings", {
         headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
       })
       .then(res => {
         var tempList=[]
         
         res.data.forEach((element)=>{
           tempList.push(element.pk)
         });
         localStorage.setItem("followings",JSON.stringify(tempList)) 
         console.log("yarrak")
       });
      this.setState({isFollowed:true});
  }
  unfollow() {
    this.state.api
      .delete(`users/${localStorage.getItem("userId")}/followings/${this.props.id}`, {
        headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
      })
      .then(response => {
      
      });
      axios
      .get("http://8.209.81.242:8000/users/"+localStorage.getItem("userId")+"/followings", {
        headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
      })
      .then(res => {
        var tempList=[]
        
        res.data.forEach((element)=>{
          tempList.push(element.pk)
        });
        localStorage.setItem("followings",JSON.stringify(tempList)) 
        console.log("yarrak")
      });
     this.setState({isFollowed:false});
  }
  render() {
    this.initializeFollowing();
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
export default UnfollowButton;
