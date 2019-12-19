import React from "react";
import OthersProfileArea from "./OthersProfileArea";
import OwnProfileArea from "./OwnProfileArea.jsx"
import {withRouter} from "react-router-dom";

class ProfilePage extends React.Component {
  constructor(props){
    
  super(props);
  this.state={
    id:this.props.match.params.id
  }
  }
  render() {
    if(localStorage.getItem("userId")==="null"){
      return (
        <div>
        You can't see!
        </div>
      );
    }
    else{
      if(this.state.id ===localStorage.getItem("userId") ){
        return (
          <div>
            <OwnProfileArea
              userId = {this.state.id}
              imageHandler={() => this.props.imageHandler}
              imageUrl={this.props.imageUrl}
            />
          </div>
        );
      }
      else{
        return (
          <div>
            <OthersProfileArea
              userId = {this.state.id}
            />
          </div>
        );
      }
    }
  }
}

export default withRouter(ProfilePage);
