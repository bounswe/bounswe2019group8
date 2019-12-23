import React, { Component } from 'react';
import { ListGroupItem, Button } from "react-bootstrap";
import {withRouter} from "react-router-dom";
import axios from  "axios";

class AnnotationSemanticHandler extends Component {
    state = { 
        articleName : ""
     }
    render() { 
        console.log(this.props.result);
            return ( 
                <div>
                <ListGroupItem>
                    <Button onClick={() => this.annotationClick()}>{"Found in annotation: \"" + this.props.result.content + "\" \t Article: " + this.state.articleName}</Button>
                    </ListGroupItem>
                </div>
             );
    }
    annotationClick = () => {
            this.props.history.push("/articles/" + this.props.result.article);
      };  
    componentWillMount(){
        var userId = localStorage.getItem("userId");
        var token = localStorage.getItem("userToken");
        axios
      .get("http://8.209.81.242:8000/articles/" + this.props.result.article,{
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        this.setState({articleName: res.data.title})
      });
    }
}
 
export default withRouter(AnnotationSemanticHandler);