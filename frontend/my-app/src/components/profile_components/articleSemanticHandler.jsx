import React, { Component } from 'react';
import { ListGroupItem, Badge } from "react-bootstrap";
import {withRouter} from "react-router-dom";
import "./anySearchHandler.css";
import { MdChromeReaderMode, MdComment, MdDateRange, MdAvTimer } from 'react-icons/md';

class ArticleSemanticHandler extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
            <ListGroupItem onClick={() => this.articleClick()} className="search-list-item">
                <Badge className="article-btn">
                <MdChromeReaderMode style={{ color: 'green', fontSize: 24, marginLeft:50, marginRight: 10}}></MdChromeReaderMode>
                    {this.props.result.title}
                    </Badge>
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