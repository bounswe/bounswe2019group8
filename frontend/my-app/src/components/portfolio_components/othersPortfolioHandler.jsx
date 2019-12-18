import React, { Component } from 'react';
import {ListGroup, ListGroupItem, Button} from "react-bootstrap";
import "./ownPortfolioPage.css";
import { withRouter } from "react-router-dom";
class OthersPortfolioHandler extends Component {
    constructor(props) {
        super(props);
    }
    state = {  }
    render() { 
        var myList = [];
        return ( 
            <div>
                <ListGroup>
                    <ListGroupItem othersId={this.props.othersId} onClick={() => this.listItemClick()} className="own-portfolio-list-group-items">
                        {this.props.name}
                    </ListGroupItem>
                </ListGroup>
            </div>
         );
    }
    listItemClick = () => {
        this.props.history.push("/profile/" + this.props.othersId + "/others_portfolio");
        this.props.history.push("/profile/" + this.props.othersId +"/others_portfolio/" + this.props.pk);
      };
}
 
export default withRouter(OthersPortfolioHandler);