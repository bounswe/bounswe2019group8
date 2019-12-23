import React, { Component } from 'react';
import axios from "axios";
import { Button, Badge, ListGroup, ListGroupItem } from "react-bootstrap";
import NotifListHandler from "./notifListHandler";
import "./notifPage.css";

class NotifPage extends Component {
    state = {
        notifList: []
    }
    render() {
        var notifList = [];
        for (var i = 0; i < this.state.notifList.length; i++) {
            notifList.push(<NotifListHandler notif={this.state.notifList[i]}></NotifListHandler>);
        }
        return (
            <div>
                <div >
                    <ListGroup  className="main-notif-continer">
                        <div style={{ margin:'auto'}}>
                            <Badge style={{ fontSize: 32, color: 'white', letterSpacing:1.4  }}>Notifications</Badge>
                        </div>
                        {notifList}
                    </ListGroup>
                </div>
            </div>
        );
    }
    componentWillMount() {
        var userId = localStorage.getItem("userId");
        var token = localStorage.getItem("userToken");
        axios
            .get("http://8.209.81.242:8000/users/" + userId + "/notifications", {
                headers: { Authorization: `Token ${token}` }
            }).then(res => {
                this.setState({ notifList: res.data });
            }
            );
    }
}

export default NotifPage;