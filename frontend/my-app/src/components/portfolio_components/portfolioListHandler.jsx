import React, { Component } from 'react';
import {ListGroup, ListGroupItem, Badge} from "react-bootstrap";
import "./ownPortfolioPage.css";
import { withRouter } from "react-router-dom";
class PortfolioHandler extends Component {
    constructor(props) {
        super(props);
    }
    state = {  }
    render() {
        var myList = [];
        return (
            <div>
                <ListGroup>
                    <ListGroupItem onClick={() => this.listItemClick()} className="own-portfolio-list-group-items">
                        <Badge className="portfolio-list-item-badge">
                        {this.props.name}
                        </Badge>
                    </ListGroupItem>
                </ListGroup>
            </div>
         );
    }
    listItemClick = () => {
        var userId = localStorage.getItem("userId");
        this.props.history.push("/profile/" + userId + "/portfolio");
        this.props.history.push("/profile/" + localStorage.getItem("userId") +"/portfolio/" + this.props.pk);
      };
}

export default withRouter(PortfolioHandler);
