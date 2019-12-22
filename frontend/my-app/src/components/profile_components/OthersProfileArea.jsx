import React from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import UpdateCredentials from "./UpdateCredentials";
import "./ProfileArea.css";
import axios from "axios";
import FollowButton from "./FollowButton.jsx"

import { FaBirthdayCake } from 'react-icons/fa'
import { MdDelete, MdFileUpload, MdEmail } from 'react-icons/md'

class OthersProfileArea extends React.Component {
  constructor() {
    super();

    this.state = {
      updateClicked: false,
      credentials: {},
      api: axios.create({
        baseURL: "http://8.209.81.242:8000/"
      }),
      users: [],
      me: { followings: [], followers: [] }
    };
  }
  componentDidMount() {
    var url = "http://8.209.81.242:8000/users/" + this.props.userId;
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
      <Card style={{ minWidth: 450, marginLeft: 15, marginTop: 10, backgroundColor: '#343a40', padding: 20 }}>
        <Card.Img style={{ borderRadius: 32 }} variant="top" src={'http://mercatus.xyz:8000' + this.state.credentials.profileImage} />
        <ListGroup className="list-group-flush">
          <ListGroup.Item style={{ textAlign: 'center', background: 'none' }}>
            <FollowButton userId={this.props.userId} />
          </ListGroup.Item>
          <div display='inline'>
            <ListGroup.Item style={{
              background: 'none', color: 'white',
              borderBottom: '1px solid white',
              borderTop: '1px solid white',
              letterSpacing: 1.8,
              fontSize: 28, textAlign: 'center', marginBottom: 18
            }}>
              {this.state.credentials.firstName +
                " " +
                this.state.credentials.lastName}
            </ListGroup.Item>
            <ListGroup.Item style={{
              fontSize: 12,
              letterSpacing: 1.3,
              borderRight: '1px solid white', background: 'none', color: 'white',
              borderRadius: 20, marginBottom: 12,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              marginRight: 8, display: 'inline-block'
            }}>
              <MdEmail style={{marginRight:8}}></MdEmail>
              {this.state.credentials.userEmail}
            </ListGroup.Item>
            <ListGroup.Item style={{
              fontSize: 12,
              letterSpacing: 1.3,
              background: 'none', color: 'white',
              borderRadius: 20, marginBottom: 12,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              marginRight: 8, display: 'inline-block'
            }}>
              <FaBirthdayCake style={{marginRight:8}}></FaBirthdayCake>
              {this.state.credentials.dateOfBirth}
            </ListGroup.Item>
          </div>

          <ListGroup.Item style={{ letterSpacing: 1.8, textAlign: 'center', borderRadius: 20, marginBottom: 12 }} action href={"/profile/" + this.props.userId + "/articles"} className="my-follow">

            Articles
            </ListGroup.Item>
          <ListGroup.Item style={{ letterSpacing: 1.8, textAlign: 'center', borderRadius: 20, marginBottom: 12 }} action href={"/profile/" + this.props.userId + "/others_portfolio"} className="my-follow">

            Portfolios
            </ListGroup.Item>

        </ListGroup>
      </Card>
    );

  }
}


export default OthersProfileArea;
