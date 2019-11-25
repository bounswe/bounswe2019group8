import React, { Component } from 'react';
import { Card, Button, Badge } from "react-bootstrap";
import "./eventCard.css"
import OneStarImportance from "./oneStarImportance";
import TwoStarImportance from "./twoStarImportance";
import ThreeStarImportance from "./threeStarImportance";
class EventCard extends Component {
    state = {  }
    render() { 
        var eventTime = this.props.eventData.time;
        if(eventTime === ""){
            eventTime = "All day"
        }
        var importance = [];
        if(this.props.eventData.importance === 1){
            importance.push(<OneStarImportance/>);
        }
        else if(this.props.eventData.importance === 2){
            importance.push(<TwoStarImportance/>);
        }
        else if(this.props.eventData.importance === 3){
            importance.push(<ThreeStarImportance/>);
        }

        return ( 
            <div className="event-card">
                <div className="event-name-div">
        <Badge className="event-field-badge">{this.props.eventData.name}</Badge>
                </div>
                <div className="event-date-div">
                <Badge className="event-field-badge">{this.props.eventData.date}</Badge>
                </div>
                <div className="event-time-div">
                <Badge className="event-field-badge">{eventTime}</Badge>
                </div>
                <div className="event-importance-div">
                <Badge className="event-field-badge">{importance}</Badge>
                </div>
                <div className="event-country-div">
                <Badge className="event-field-badge">{this.props.eventData.country}</Badge>
                </div>
                
                
            </div>
                   
            
         );
    }
}
 
export default EventCard;