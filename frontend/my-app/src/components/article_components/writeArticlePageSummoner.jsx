import React, { Component } from 'react';
import WriteArticlePage from "./writeArticlePage";
import {withRouter} from "react-router-dom";

class WriteArticleSummoner extends Component {
    state = {  }


    render() { 
        return ( 
            <React.Fragment>
                <WriteArticlePage  />
            </React.Fragment>
         );
    }
    submitClicked = () => {
        
    }
}
 
export default withRouter(WriteArticleSummoner);