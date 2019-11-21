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
  componentDidMount(){
    if(this.props.match.params.id===this.state.id){
      this.setState({id:this.props.match.params.id})
      this.render()
    }
  }
  shouldComponentUpdate(){
    return true;
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
