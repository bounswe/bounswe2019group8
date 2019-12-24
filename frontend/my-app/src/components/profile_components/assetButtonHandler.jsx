import React, { Component } from 'react';
import { Badge } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import "./assetButtonHandler.css";

class AssetButtonHandler extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
                <Badge className="asset-button-in-profile" action href ={"/treq/" + this.props.el.tr_eq.sym} onClick={()=> this.handleClick()}>
                        {this.props.el.amount.replace('.', ',') + ' ' + this.props.el.tr_eq.sym.split('_')[0] + ' (' + this.props.el.tr_eq.name + ')'}
                </Badge>
            </div>
         );
    }
    handleClick = () => {
        this.props.history.push("/treq/" + this.props.el.tr_eq.sym);
      }
}
 
export default withRouter(AssetButtonHandler);