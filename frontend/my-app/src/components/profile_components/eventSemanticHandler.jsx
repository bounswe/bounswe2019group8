import React, { Component } from 'react';
import { ListGroupItem, Badge } from "react-bootstrap";
import {withRouter} from "react-router-dom";
import "./anySearchHandler.css";
import {FaCalendarDay} from 'react-icons/fa';
class ArticleSemanticHandler extends Component {
    state = {  }
    render() {
        return (
            <div>
            <ListGroupItem onClick={() => this.eventClick()}  className="search-list-item">
                <Badge className="event-btn">
                <FaCalendarDay style={{ color: 'green', fontSize: 24, marginLeft:50, marginRight: 10}}></FaCalendarDay>
                Event:
                    {this.props.result.name}
                    </Badge>
                </ListGroupItem>
            </div>
         );
    }
    eventClick = () => {
        //path="/events#:eventId"
        this.props.history.push("/events#" + this.props.result.id);
    }
}

export default withRouter(ArticleSemanticHandler);
