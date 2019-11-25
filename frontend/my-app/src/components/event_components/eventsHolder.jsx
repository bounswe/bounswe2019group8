import React, { Component } from 'react';
import EventCard from "./eventCard";
import "./eventsHolder.css"
import EventMenu from "./eventMenu";
import { Card, Button, Badge, ListGroup, ListGroupItem } from "react-bootstrap";
class EventsHolder extends Component {
    state = {  }
    render() {
        var threeDaysEventsList = [];
        var secondEventsList = [];
        var eventsJson = JSON.parse(localStorage.getItem("threeDaysEventsList"));
        console.log(eventsJson.length);
        if(eventsJson !== null){
          for (var i = 0; i < eventsJson.length; i++) {
            threeDaysEventsList.push(<EventCard eventData={eventsJson[i]}></EventCard>);
            secondEventsList.push(<ListGroupItem className="event-list-item">
                {threeDaysEventsList[i]}
            </ListGroupItem>)
          }
        }

        
        if(threeDaysEventsList.length !== 0){
          return (
            <div className="events-holder-body">
                <ListGroup className="event-listgroup-item">
                <ListGroupItem className="event-listgroup-item">
                    <EventMenu></EventMenu>
            </ListGroupItem>
                    {secondEventsList}
                </ListGroup>
            </div>
          );
        }else{
          return <div/>
        }
        
      }
}
 
export default EventsHolder;