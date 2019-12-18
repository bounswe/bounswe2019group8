import React, { Component } from 'react';
import {Button, Dropdown, ListGroupItem} from "react-bootstrap";
import DropdownItem from 'react-bootstrap/DropdownItem';

class DropDownHandler extends Component {
    state = {  }
    
    render() { 
        var eqsToGive = [];
        //for(var i = 0; i < this.props.eqList.length; i++){
        //eqsToGive.push(<DropdownItem onClick={this.handleAdd}>{this.props.eqList[i].name}</DropdownItem>)
        //}
        return ( 
            <div>
                {<DropdownItem onClick={()=>this.handleAdd()}>{this.props.eq.name}</DropdownItem>}
            </div>
         );
    }
    handleAdd = () => {
        var a = this.props.eq.sym;
        this.props.onDropDownHandler(a);            
    }
}
 
export default DropDownHandler;