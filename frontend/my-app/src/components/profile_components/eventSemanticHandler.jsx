import React, { Component } from 'react';
import { ListGroupItem, Button } from "react-bootstrap";
import {withRouter} from "react-router-dom";

class ArticleSemanticHandler extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
            <ListGroupItem>
                <Button onClick={() => this.eventClick()}>{"Found event: " + this.props.result.name}</Button>
                {console.log(this.props.result)}
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