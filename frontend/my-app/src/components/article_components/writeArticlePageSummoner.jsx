import React, { Component } from 'react';
import WriteArticlePage from "./writeArticlePage";
import {withRouter} from "react-router-dom";

class WriteArticlePageSummoner extends Component {
    state = {  }


render() { 
        return ( 
            <React.Fragment>
                <WriteArticlePage submitClicked={this.submitClicked} />
            </React.Fragment>
         );
    }
submitClicked =() => {
        this.props.history.push("/articles")
}
}
 
export default withRouter(WriteArticlePageSummoner);