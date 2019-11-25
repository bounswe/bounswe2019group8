import React, { Component } from "react";
import {Route} from "react-router-dom";
import "../profile_components/ProfileArea.css";
import axios from "axios";
import { Button, Card, ListGroup } from "react-bootstrap";
import { FaThumbsDown } from "react-icons/fa";

class ArticleDislike extends Component {
  state = {
    api: axios.create({
    baseURL: "http://8.209.81.242:8000/"
  }),
    disLiked : false,
    alreadyLiked: false
    };
 componentWillMount(){
    var tempList=[]
    axios
    .get("http://8.209.81.242:8000/articles/"+this.props.articlePk+"/dislikes", {
      headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
    })
    .then(res => {
      res.data.forEach((element)=>{
        this.props.decRating()
        if (element.liker.toString() === localStorage.getItem("userId")){
            this.props.makeDisslike();
        }
      });
    });
  
  
  }
  
    dislike =()=> {
      var tempList=[]
      console.log(localStorage.getItem("userToken"))
      var token = localStorage.getItem("userToken");
      console.log(token)
      
    this.state.api
    .delete("articles/"+this.props.articlePk+"/likes", {
      headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
    })
    .then(response => {
      if(response.data === 200){
        this.props.decRating()
      }
    });
      axios
      .post("http://8.209.81.242:8000/articles/"+this.props.articlePk+"/dislikes",{},
      {
        headers: { Authorization: `Token ${token}` }
      }
      )
      .then(response => {
        axios
        .get("http://8.209.81.242:8000/articles/"+this.props.articlePk+"/dislikes", {
          headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
        })
        .then(res => {
          res.data.forEach((element)=>{
            if (element.liker.toString() === localStorage.getItem("userId")){
                this.props.makeDisslike();
            }
          });
        });
        this.props.decRating()
        
       });
  }
  undislike=()=> {
    this.state.api
      .delete("articles/"+this.props.articlePk+"/dislikes", {
        headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
      })
      .then(response => {
        axios
        .get("http://8.209.81.242:8000/articles/"+this.props.articlePk+"/dislikes", {
          headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
        })
        .then(res => {
          var count = 0;
            res.data.forEach((element)=>{
            if (element.liker.toString() === localStorage.getItem("userId")){
                count = count +1
                
            }
          });
          if(count ===0){
            this.props.makeNeutral();
          }
          this.props.incRating()
        });
      });
     
  }
  render() {
    
        if(this.props.likeState===2){
            return(
                <React.Fragment>
                <FaThumbsDown style={{ marginLeft: 15, marginTop:35, color: "#3C3C3C" , fontSize: "50px" }} onClick={() => this.undislike()} />
                </React.Fragment>
                )
        }
        else {
           return( 
           <React.Fragment>
          <FaThumbsDown style={{ marginLeft: 15, marginTop:35, color: "#A4A4A4" , fontSize: "50px" }} onClick={() => this.dislike()} />
            </React.Fragment>)
            
        }
    
  
  
  }
}
export default ArticleDislike;
