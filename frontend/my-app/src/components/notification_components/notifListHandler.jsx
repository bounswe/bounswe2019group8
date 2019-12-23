import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Badge, Button } from "react-bootstrap";
import axios from "axios";
import "./notifListHandler.css";
import { withRouter } from "react-router-dom";
import { MdChromeReaderMode, MdComment, MdDateRange, MdAvTimer } from 'react-icons/md'
import { FaStickyNote, FaUserCircle } from 'react-icons/fa'

class NotifListHandler extends Component {
    state = {
        senderName: ""
    }
    render() {
        var reason = "";
        if (this.props.notif.reason === "article_create") {
            reason = "New article";
        }
        else if (this.props.notif.reason === "comment_create") {
            reason = "New comment";
        }
        else if (this.props.notif.reason === "annotation_create") {
            reason = "New annotation";
        }
        console.log(this.props.notif);
        var date = this.props.notif.created_at.substring(0, 10);
        var time = this.props.notif.created_at.substring(11, 19);
        return (
            <div className="single-notif-container">
                <ListGroupItem className='notif-item'>
                    <div style={{ width: '100%', alignItems: 'center' }} className="single-notif-all-tags-container">
                        <div style={{width:'8%'}}>
                            {reason == "New article" ?
                                <MdChromeReaderMode style={{ color: 'green', fontSize: 24 }}></MdChromeReaderMode>
                                : (reason == "New comment") ?
                                    <MdComment style={{ color: 'brown', fontSize: 24 }}></MdComment> :
                                    <FaStickyNote style={{ color: '#B4CDCD', fontSize: 24 }}></FaStickyNote>
                            }
                        </div>
                        <Button style={{ width: '22%', marginRight:20 }} className="notif-type-btn" disabled>{reason}</Button>
                        <MdDateRange style= {{fontSize:24, width:'9%'}}></MdDateRange>
                        <Button className="notif-date-btn" disabled>{date}</Button>
                        <MdAvTimer style={{fontSize:24}}></MdAvTimer>
                        <Button className="notif-time-btn" disabled>{time}</Button>
                        <FaUserCircle style={{fontSize:24, marginRight:16}}></FaUserCircle>
                        <Button style={{ width: '15%' }} onClick={() => this.otherProfileClick()}
                            className="notif-from-btn">{ this.state.senderName}
                        </Button>
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
    componentWillMount() {
        var userId = localStorage.getItem("userId");
        var token = localStorage.getItem("userToken");
        axios
            .get("http://8.209.81.242:8000/users/" + this.props.notif.source_user, {
                headers: { Authorization: `Token ${token}` }
            }).then(res => {
                this.setState({ senderName: res.data.first_name + " " + res.data.last_name })
                this.setState({ senderId: res.data.pk });
            }
            );
    }
}

export default withRouter(NotifListHandler);