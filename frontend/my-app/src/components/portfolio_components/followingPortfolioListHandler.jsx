import React, { Component } from 'react';
import {ListGroup, ListGroupItem, Button} from "react-bootstrap";
import "./ownPortfolioPage.css";
import { withRouter } from "react-router-dom";
class FollowingPortfolioHandler extends Component {
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
                        {this.props.name}
                    </ListGroupItem>
                </ListGroup>
            </div>
         );
    }
    listItemClick = () => {
        var userId = localStorage.getItem("userId");
        this.props.history.push("/profile/" + userId + "/portfolio");
        this.props.history.push("/profile/" + this.props.ownerId +"/others_portfolio/" + this.props.pk);
      };
}
 
export default withRouter(FollowingPortfolioHandler);