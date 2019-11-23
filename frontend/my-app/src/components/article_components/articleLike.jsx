import React, { Component } from "react";
import {Route} from "react-router-dom";
import "../profile_components/ProfileArea.css";
import axios from "axios";
import { Button, Card, ListGroup } from "react-bootstrap";

class ArticleLike extends Component {
  state = {
    api: axios.create({
    baseURL: "http://8.209.81.242:8000/"
  }),
    isLiked : false,
    alreadyDissed:false
    };
 componentWillMount(){
   
    axios
    .get("http://8.209.81.242:8000/articles/"+this.props.articlePk+"/likes", {
      headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
    })
    .then(res => {
      res.data.forEach((element)=>{
        if (element.liker.toString() === localStorage.getItem("userId")){
            this.props.makeLike();
        }
        
      });
      
    });
 
  
  }
  
    like =()=> {
      var tempList=[]
      console.log(localStorage.getItem("userToken"))
      var token = localStorage.getItem("userToken");
      console.log(token)
      axios
      .post("http://8.209.81.242:8000/articles/"+this.props.articlePk+"/likes",{},
      {
        headers: { Authorization: `Token ${token}` }
      }
      )
      .then(response => {
        axios
        .get("http://8.209.81.242:8000/articles/"+this.props.articlePk+"/likes", {
          headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
        })
        .then(res => {
          res.data.forEach((element)=>{
            if (element.liker.toString() === localStorage.getItem("userId")){
                this.props.makeLike();
            }
          });
          
        });
       
        
       });
  }
  unlike=()=> {

    this.state.api
      .delete("articles/"+this.props.articlePk+"/likes", {
        headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
      })
      .then(response => {
        axios
        .get("http://8.209.81.242:8000/articles/"+this.props.articlePk+"/likes", {
          headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
        })
        .then(res => {
          var count = 0
            res.data.forEach((element)=>{
            if (element.liker.toString() === localStorage.getItem("userId")){
               count = count +1
            }
          });
          if(count ===0){
            this.props.makeNeutral();
          }
        });
      });
     
  }
  render() {
    
        if(this.props.likeState===1){
            return(
                <React.Fragment>
                <button
                          id="loginStyles"
                          class="myButton"
                          onClick={() => this.unlike()}
                          //variant="outline-success"
                        >
                          Unlike
                        </button>
                </React.Fragment>
                )
        }
        else if(this.props.likeState===0){
           return( 
           <React.Fragment>
            <button
                      id="loginStyles"
                      class="myButton"
                      onClick={() => this.like()}
                      //variant="outline-success"
                    >
                      Like
            </button>
            </React.Fragment>)
            
        }
    
    else{
        return(<React.Fragment></React.Fragment>)
    }
   
  
  }
}
export default ArticleLike;
