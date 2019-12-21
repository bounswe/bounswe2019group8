import React, { Component } from 'react';
import { ListGroupItem, Button } from "react-bootstrap";
import {withRouter} from "react-router-dom";

class UserSearchHandler extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
            <ListGroupItem>
                <Button onClick={() => this.profileClick()}>{this.props.result.first_name + " " + this.props.result.last_name}</Button>
                </ListGroupItem>
            </div>
         );
    }

    profileClick = () => {
        //this.props.history.push("/login");
        this.props.history.push("/profile/" + this.props.result.pk);
      };
}
 
export default withRouter(UserSearchHandler);