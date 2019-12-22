import React, { Component } from 'react';
import { ListGroupItem, Button } from "react-bootstrap";
import {withRouter} from "react-router-dom";

class CommentSemanticHandler extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
            <ListGroupItem>
                <Button >{"Found in comment: \"" + this.props.result.content + "\""}</Button>
                </ListGroupItem>
            </div>
         );
    }

    
}
 
export default withRouter(CommentSemanticHandler);