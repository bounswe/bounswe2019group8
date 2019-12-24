import React, { Component } from 'react';
import { ListGroupItem, Badge } from "react-bootstrap";
import {withRouter} from "react-router-dom";
import "./anySearchHandler.css";
import { FaStickyNote, FaUserCircle } from 'react-icons/fa'

class UserSearchHandler extends Component {
    state = {  }
    render() { 
        return ( 
            <div >
            <ListGroupItem onClick={() => this.profileClick()} className="search-list-item" >
                <div className="outer">
                <FaUserCircle style={{fontSize:24, marginRight:16, marginTop: 0}}></FaUserCircle>
                <Badge className="user-btn">{this.props.result.first_name + " " + this.props.result.last_name}</Badge>
                </div>
                </ListGroupItem>
            </div>
         );
    }

    profileClick = () => {
        //this.props.history.push("/login");
        this.props.history.push("/profile/" + this.props.result.pk);
      };
}
 
export default withRouter(UserSearchHandler);