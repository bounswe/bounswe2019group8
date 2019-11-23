import React, { Component } from "react";
import ParityBadge from "./parityBadge";
import "./parityBadgeHolder.css";
class ParityBadgeHolder extends Component {
  state = {};
  render() {
    var parityBadgeList = [];
    var parityJson = JSON.parse(localStorage.getItem("equipmentList"));
    if(parityJson !== null){
      for (var i = 0; i < parityJson.length; i++) {
        parityBadgeList.push(<ParityBadge name={parityJson[i].name} parityPk={parityJson[i].pk}/>);
      }
    }
    
    if(parityBadgeList.length !== 0){
      return (
        <React.Fragment>
          <div className="parity-badge-container">
            <div className="parity-container">{parityBadgeList}</div>
          </div>
        </React.Fragment>
      );
    }else{
      return <div/>
    }
    
  }
}

export default ParityBadgeHolder;
