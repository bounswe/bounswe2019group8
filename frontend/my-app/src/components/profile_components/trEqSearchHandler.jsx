import React, { Component } from 'react';
import { ListGroupItem, Button } from "react-bootstrap";
import {withRouter} from "react-router-dom";

class TrEqSearchHandler extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
            <ListGroupItem>
            <Button>{this.props.result.name}</Button>
            </ListGroupItem>
            </div>
         );
    }
}
 
export default withRouter(TrEqSearchHandler);