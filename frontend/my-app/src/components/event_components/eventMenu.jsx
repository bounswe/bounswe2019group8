import React, { Component } from 'react';
import {Badge} from "react-bootstrap";
import "./eventMenu.css";

class EventMenu extends Component {
    state = {  }
    render() { 
        return ( 
            <div className="menu-div">
                <Badge className="name-badge">Name</Badge>
                <Badge className="date-badge">Date</Badge>
                <Badge className="time-badge">Time</Badge>
                <Badge className="importance-badge">Importance</Badge>
                <Badge className="country-badge">Country</Badge>
            </div>
         );
    }
}
 
export default EventMenu;