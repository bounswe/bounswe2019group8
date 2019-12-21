import React, { Component } from 'react';
import {Button} from "react-bootstrap";
import axios from "axios";
import {FaHeart} from "react-icons/fa";
import "./followPortfolioButton.css";

class FollowPortfolioButton extends Component {
    state = {
        isFollowed: false,
        followList: []
        };
     componentWillMount(){
        var userId = localStorage.getItem("userId");
        var token = localStorage.getItem("userToken");
        axios
          .get("http://8.209.81.242:8000/users/" + userId + "/following_portfolios",{
            headers: { Authorization: `Token ${token}` }}).then(res => {
                console.log(res);
                this.setState({followList: res.data});
                this.setState({isFollowed: false});
                for(var i = 0; i < res.data.length; i++){
                    if(this.props.pk == res.data[i].pk){
                        this.setState({isFollowed: true});
                    }
                }
          }
    
          );
      }
      
        follow =()=> {
          var tempList=[]
          var userId = localStorage.getItem("userId");
          var token = localStorage.getItem("userToken");
          var data = {
            "portfolio_pk": this.props.pk
          };
          axios
          .post("http://8.209.81.242:8000/users/"+userId+"/following_portfolios", data, {
        headers: { Authorization: `Token ${token}` }
      })
          .then(response => {
            console.log(response);
            /*axios
            .get("http://8.209.81.242:8000/users/"+localStorage.getItem("userId")+"/followings", {
              headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
            })
            .then(res => {
              res.data.forEach((element)=>{
                tempList.push(element.pk)
              });
              localStorage.setItem("followings",JSON.stringify(tempList)) 
            });*/
            //this.setState({isFollowed:true});
            
           });
      }
      unfollow=()=> {
        console.log("inside unfollow");
        var tempList=[];
        var userId = localStorage.getItem("userId");
        var token = localStorage.getItem("userToken");
        axios
          .delete("http://8.209.81.242:8000/users/"+userId+"/following_portfolios/" + this.props.pk, {
            headers: { Authorization: `Token ${token}` }
          })
          .then(response => {
            console.log(response);
            /*axios
            .get("http://8.209.81.242:8000/users/"+localStorage.getItem("userId")+"/followings", {
              headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
            })
            .then(res => {
              res.data.forEach((element)=>{
                tempList.push(element.pk)
              });
              localStorage.setItem("followings",JSON.stringify(tempList)) 
            });
            this.setState({isFollowed:false});*/
          });
         
      }
      render() {
        if(this.state.isFollowed){
            return(
                <React.Fragment>
                    <Button onClick={() => this.unfollow()} className="follow-portfolio-btn" action href ={"/profile/" + this.props.othersId +"/others_portfolio/" + this.props.pk}>
                    Unfollow
                    </Button>
                </React.Fragment>
                )
        }
        else{
           return( 
           <React.Fragment>
                <Button onClick={() => this.follow()} className="follow-portfolio-btn" action href ={"/profile/" + this.props.othersId +"/others_portfolio/" + this.props.pk}>
                Follow
                </Button>
            </React.Fragment>)
            
        }
      
      }
}
 
export default FollowPortfolioButton;