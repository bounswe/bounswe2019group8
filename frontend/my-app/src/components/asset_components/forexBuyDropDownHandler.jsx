import React, { Component } from 'react';
import {Button, Dropdown, ListGroupItem} from "react-bootstrap";
import DropdownItem from 'react-bootstrap/DropdownItem';

class ForexBuyDropDownHandler extends Component {
    state = {  }
    
    render() { 
        console.log(this.props.asset);
        return ( 
            <div>
                {/*<DropdownItem >{this.props.asset.name}</DropdownItem>*/}
                hello
            </div>
         );
    }
    handleAdd = () => {
                
    }
}
 
export default ForexBuyDropDownHandler;