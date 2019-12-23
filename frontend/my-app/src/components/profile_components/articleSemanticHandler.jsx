import React, { Component } from 'react';
import { ListGroupItem, Button } from "react-bootstrap";
import {withRouter} from "react-router-dom";

class ArticleSemanticHandler extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
            <ListGroupItem>
                <Button onClick={() => this.articleClick()}>{"Found in article: " + this.props.result.title}</Button>
                {console.log(this.props.result)}
                </ListGroupItem>
            </div>
         );
    }

    articleClick = () => {
        //this.props.history.push("/login");
        if(this.props.result.author === localStorage.getItem("userId")){
            this.props.history.push("/articles/" + this.props.result.pk);
        }
        else{
            this.props.history.push("/articles/" + this.props.result.pk);
        }
        
      };
}
 
export default withRouter(ArticleSemanticHandler);