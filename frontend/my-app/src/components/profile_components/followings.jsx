import React, { Component } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import axios from "axios";
import {withRouter} from "react-router-dom";

class Followings extends Component {
  state = {
    followings:[]
  };

  componentDidMount(){
    var tempList =[];
    axios
    .get("http://8.209.81.242:8000/users/"+localStorage.getItem("userId")+"/followings", {
      headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
    })
    .then(res => {
      res.data.forEach((element)=>{
        tempList.push(element)
      });
     this.setState({followings:tempList})
     {console.log(this.state.followings)}
    });
  }
  render() {
    console.log("i get clalled")
    return(
    <React.Fragment>
       <Card style={{ width: "36rem", align: "center" }}>
       {console.log(this.state.followings)}
          <ListGroup className="list-group-flush">
          <ListGroup.Item>
             Followings :
              <ListGroup className="list-group-flush">
                {this.state.followings.map((f, i) => (
                   <ListGroup.Item action href ={"/profile/"+f.pk}>
                      {i + 1} - {`${f.first_name} ${f.last_name}`}
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </ListGroup.Item>     
          </ListGroup>
       
        </Card>
    </React.Fragment>
    )
  }

}
export default withRouter(Followings);
