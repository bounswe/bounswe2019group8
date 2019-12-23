import React, { Component } from 'react';
import { ListGroupItem, Button } from "react-bootstrap";
import {withRouter} from "react-router-dom";

class CommentSemanticHandler extends Component {
    state = {  }
    render() { 
        console.log(this.props.result);
        var prop = "article";
        var prop2 = "trading_equipment";
        if(this.props.result.hasOwnProperty(prop)){
            return ( 
                <div>
                <ListGroupItem>
                    <Button onClick={() => this.articleCommentClick()}>{"Found in comment: \"" + this.props.result.content + "\""}</Button>
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