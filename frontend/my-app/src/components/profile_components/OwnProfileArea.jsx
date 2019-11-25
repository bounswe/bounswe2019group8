import React from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import UpdateCredentials from "./UpdateCredentials";
import "./ProfileArea.css";
import axios from "axios";
import {withRouter} from "react-router-dom";
class OwnProfileArea extends React.Component {
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
    var url =
    "http://8.209.81.242:8000/users/" + localStorage.getItem("userId");
  var credentials1 = { ...this.state.credentials };
  var id = localStorage.getItem("userId");
  var token = localStorage.getItem("userToken");
  credentials1.id = id;
  credentials1.userToken = token;
  var userType;
  axios
    .get("http://8.209.81.242:8000/users", {
      headers: { Authorization: `Token ${token}` }
    })
    .then(res => {
      this.setState({ users: res.data });
    });
  axios
    .get(url, { headers: { Authorization: `Token ${token}` } })
    .then(res => {

      var credentials = { ...this.state.credentials };
      credentials.userEmail = res.data.email;
      credentials.firstName = res.data.first_name;
      credentials.lastName = res.data.last_name;
      credentials.dateOfBirth = res.data.date_of_birth;
      credentials.id = id;
      credentials.userToken = token;
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
        <Card >
          <Card.Img variant="top" src={require("../images/rick.jpg")} />
          <ListGroup className="list-group-flush">
          <ListGroup.Item action href ="/followers" className="my-follow">
            
                      My Followers
                      </ListGroup.Item>
          <ListGroup.Item action href ="/followings" className="my-follow"> 
                      My Followings
             
            </ListGroup.Item>
            <ListGroup.Item action href ={"/profile/" + localStorage.getItem("userId") +"/articles"} className="my-follow">
            
                      Articles            
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
          <Card.Body>
           
              <Button
                style={myCredentials}
                variant="outline-danger"
                size="sm"
                href="/upd_cred"
              >
                Update Info
              </Button>
          
          </Card.Body>
        </Card>
      );
  }
  handleUpdateClick = () => {
    this.setState({ updateClicked: !this.state.updateClicked });
  };
  followingsClick = () =>{
    this.props.history.push("/followings")
  }
}


export default withRouter(OwnProfileArea);
