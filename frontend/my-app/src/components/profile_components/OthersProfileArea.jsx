import React from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import UpdateCredentials from "./UpdateCredentials";
import "./ProfileArea.css";
import axios from "axios";
import FollowButton from "./FollowButton.jsx"
class OthersProfileArea extends React.Component {
  constructor() {
    super();

    this.state = {
      updateClicked: false,
      credentials:{},
      api: axios.create({
        baseURL: "http://8.209.81.242:8000/"
      }),
      users:[],
      me:{followings:[],followers:[]}
    };
  }
  componentDidMount() {
  var url ="http://8.209.81.242:8000/users/" + this.props.userId;
  var credentials1 = { ...this.state.credentials };
  var token = localStorage.getItem("userToken");
  credentials1.id = this.props.id;
  credentials1.userToken = token;
  axios
    .get(url, { headers: { Authorization: `Token ${token}` } })
    .then(res => {
      var credentials = { ...this.state.credentials };
      credentials.profileImage = res.data.profile_image
      credentials.userEmail = res.data.email;
      credentials.firstName = res.data.first_name;
      credentials.lastName = res.data.last_name;
      credentials.dateOfBirth = res.data.date_of_birth;
      credentials.id = this.props.id;
      credentials.userGroup = res.data.groups[0];
      this.setState({ credentials: credentials });
    });   
  }



  updateMe() {
    this.props.api
      .get(`users/${this.props.credentials.id}`, {
        headers: { Authorization: `Token ${this.props.credentials.userToken}` }
      })
      .then(response => {
        console.log(response);

        if (response.statusText === "OK") {
          this.setState({ me: response.data });
        }
      });
  }

  render() {
    const myCredentials = {
      margin: 10
    };
      
      return (
        <Card>
          <Card.Img variant="top" src={'http://mercatus.xyz:8000' + this.state.credentials.profileImage} />
          <ListGroup className="list-group-flush">
            <ListGroup.Item>
            <FollowButton userId={this.props.userId}/></ListGroup.Item>
            <ListGroup.Item action href ={"/profile/" + this.props.userId +"/articles"} className="my-follow">
            
                      Articles            
            </ListGroup.Item>
            <ListGroup.Item action href ={"/profile/" + this.props.userId +"/others_portfolio"} className="my-follow">
            
                      Portfolios           
            </ListGroup.Item>
            <ListGroup.Item>
              {this.state.credentials.firstName +
                " " +
                this.state.credentials.lastName}
            </ListGroup.Item>
            <ListGroup.Item>{this.state.credentials.userEmail}</ListGroup.Item>
            <ListGroup.Item>
              {this.state.credentials.dateOfBirth}
            </ListGroup.Item>
          </ListGroup>
        </Card>
      );
    
  }
}


export default OthersProfileArea;
