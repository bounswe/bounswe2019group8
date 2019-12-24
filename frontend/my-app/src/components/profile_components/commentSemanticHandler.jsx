import React, { Component } from 'react';
import { ListGroupItem, Badge } from "react-bootstrap";
import {withRouter} from "react-router-dom";
import "./anySearchHandler.css";
import {MdComment} from 'react-icons/md';

class CommentSemanticHandler extends Component {
    state = {  }
    render() { 
        console.log(this.props.result);
        var prop = "article";
        var prop2 = "trading_equipment";
        if(this.props.result.hasOwnProperty(prop)){
            return ( 
                <div>
                <ListGroupItem onClick={() => this.articleCommentClick()} className="search-list-item">
                    <Badge className="comment-btn" >
                    <MdComment style={{ color: 'green', fontSize: 24, marginLeft:50, marginRight: 10}}></MdComment>
                        {this.props.result.content}
                        </Badge>
                    </ListGroupItem>
                </div>
             );
        }
        else if(this.props.result.hasOwnProperty(prop2)){
            return ( 
                <div>
                This one is an equipment comment.
                </div>
             );
        }
    }
    articleCommentClick = () => {
        this.props.history.push("/articles/" + this.props.result.article);
      };

    
}
 
export default withRouter(CommentSemanticHandler);