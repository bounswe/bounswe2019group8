import React, { Component } from 'react';
import {ListGroup, ListGroupItem, Badge, Button} from "react-bootstrap";
import axios from "axios";
import "./notifListHandler.css";
import { withRouter } from "react-router-dom";

class NotifListHandler extends Component {
    state = { 
        senderName : ""
     }
    render() { 
        var reason = "";
        if(this.props.notif.reason === "article_create"){
            reason = "New article";
        }
        else if(this.props.notif.reason === "comment_create"){
            reason = "New comment";
        }
        else if(this.props.reason === "annotation_create"){
            reason = "New annotation"
        }
        console.log(this.props.notif);
        var date = this.props.notif.created_at.substring(0,10);
        var time = this.props.notif.created_at.substring(11,19);
        return ( 
            <div className="single-notif-container">
                    <ListGroupItem>
                        <div className="single-notif-all-tags-container">
                        <Button className="notif-type-btn" disabled>{reason}</Button>
                        <Button className="notif-date-btn" disabled>{date}</Button>
                        <Button className="notif-time-btn" disabled>{time}</Button>
                        <Button onClick={() => this.otherProfileClick()} className="notif-from-btn">{ "from: " +this.state.senderName}</Button>
                        </div>
                    </ListGroupItem>
            </div>
         );
    }
    otherProfileClick = () => {
        this.componentWillMount();
        this.props.history.push("/profile/" + localStorage.getItem("userId") + "/notif");
        this.props.history.push("/profile/" + this.props.notif.source_user);
      };
    componentWillMount(){
        var userId = localStorage.getItem("userId");
        var token = localStorage.getItem("userToken");
        axios
        .get("http://8.209.81.242:8000/users/" + this.props.notif.source_user,  {
          headers: { Authorization: `Token ${token}` }}).then(res => {
          this.setState({senderName: res.data.first_name + " " + res.data.last_name})
          this.setState({senderId: res.data.pk});    
        }
        );
    }
}
 
export default withRouter(NotifListHandler);