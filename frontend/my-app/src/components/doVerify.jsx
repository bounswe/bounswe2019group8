import React, { Component } from 'react';
import axios from "axios";
import {withRouter} from "react-router-dom";
import { Card, Button } from "react-bootstrap";
class DoVerify extends Component {
    state = { 
        restOfUrl: "",
        verified: false
     }
    render() { 
        if(this.state.verified === false){
            return ( 
                <div>
                     <Card>
        <Card.Body>
          <Card.Text>Please Verify Your Account</Card.Text>
        </Card.Body>
      </Card>
                </div>
             );
        }
        else{
            this.props.history.push("/");
        }
    }
    componentWillMount(){
        this.setState({ restOfUrl: this.props.match.params.restOfUrl });
        axios
        .get("http://8.209.81.242:8000/activations/" + this.props.match.params.restOfUrl)
        .then(res => {
            if(res.status==="200"){
                this.setState({verified: true});
            }
        });
    }
}
 
export default withRouter(DoVerify);