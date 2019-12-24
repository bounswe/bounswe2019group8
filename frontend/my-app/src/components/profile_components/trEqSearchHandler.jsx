import React, { Component } from 'react';
import { ListGroupItem, Badge } from "react-bootstrap";
import {withRouter} from "react-router-dom";
import "./anySearchHandler.css";
import { FaMoneyCheckAlt } from 'react-icons/fa';
class TrEqSearchHandler extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
            <ListGroupItem action href={"/treq/"+ this.props.result.sym} className="search-list-item">
            <Badge className="trEq-btn">
            <FaMoneyCheckAlt style={{fontSize:20, marginRight:16, marginTop: 0}}></FaMoneyCheckAlt>  
                {this.props.result.name}
                </Badge>
            </ListGroupItem>
            </div>
         );
    }
}
 
export default withRouter(TrEqSearchHandler);