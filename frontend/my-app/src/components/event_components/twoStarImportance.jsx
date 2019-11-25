import React, { Component } from 'react';
import { Badge } from "react-bootstrap";
class TwoStarImportance extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
                <img
            src={require("../images/importance-star.png")}
            height="30"
            weight="30"
            alt="mercatus"
          />
          <img
            src={require("../images/importance-star.png")}
            height="30"
            weight="30"
            alt="mercatus"
          />
          </div>
         );
    }
}
 
export default TwoStarImportance;