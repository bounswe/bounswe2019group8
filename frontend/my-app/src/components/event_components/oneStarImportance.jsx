import React, { Component } from 'react';
import { Badge } from "react-bootstrap";
class OneStarImportance extends Component {
    state = {  }
    render() { 
        return ( 
            
                <img
            src={require("../images/importance-star.png")}
            height="30"
            weight="30"
            alt="mercatus"
          />
         );
    }
}
 
export default OneStarImportance;