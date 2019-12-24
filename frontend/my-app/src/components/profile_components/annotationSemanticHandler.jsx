import React, { Component } from 'react';
import { ListGroupItem, Badge } from "react-bootstrap";
import {withRouter} from "react-router-dom";
import axios from  "axios";
import "./anySearchHandler.css";
import { MdChromeReaderMode } from 'react-icons/md';
import { FaStickyNote } from 'react-icons/fa';

class AnnotationSemanticHandler extends Component {
    state = { 
        articleName : ""
     }
    render() { 
        console.log(this.props.result);
            return ( 
                <div>
                <ListGroupItem onClick={() => this.annotationClick()} className="search-list-item">
                    
            <Badge className="annotation-btn">
            <FaStickyNote style={{fontSize:20, marginRight:16, marginTop: 0}}></FaStickyNote>  
            { this.props.result.content }
            <MdChromeReaderMode style={{ color: 'green', fontSize: 24, marginLeft:50, marginRight: 10}}></MdChromeReaderMode>
            {this.state.articleName}
            </Badge>
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