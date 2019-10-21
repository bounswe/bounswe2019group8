import React, { PropTypes, useState } from "react";
import { Button, Card, ListGroup, Modal } from "react-bootstrap";
import Users from "./Users";
import UpdateCredentials from "./UpdateCredentials";
class ProfileArea extends React.Component {
  state = { updateClicked: false };
  render() {
    const myCredentials = {
      margin: 10
    };
    if (this.state.updateClicked === true) {
      return (
        <Card style={{ width: "36rem" }}>
          <Card.Img variant="top" src={require("./rick.jpg")} />
          <Card.Body>
            <Card.Title>Bio</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>{this.props.credentials.userName}</ListGroup.Item>
            <ListGroup.Item>{this.props.credentials.userEmail}</ListGroup.Item>
            <ListGroup.Item>Another Info</ListGroup.Item>
          </ListGroup>
          <Card.Body>
            <Card.Link href="#">
              <Users users={this.props.users} />
            </Card.Link>
            <Card.Link href="#">
              <Button style={myCredentials} variant="outline-success" size="sm">
                Follows
              </Button>
            </Card.Link>
            <Card.Link href="#">
              <Button
                style={myCredentials}
                variant="outline-danger"
                size="sm"
                onClick={this.handleUpdateClick}
              >
                Update Info
              </Button>
            </Card.Link>
            <Card.Link href="#">
              <UpdateCredentials
                style={myCredentials}
                variant="outline-danger"
                size="sm"
              >
                Update Info
              </UpdateCredentials>
            </Card.Link>
          </Card.Body>
        </Card>
      );
    } else {
      return (
        <Card style={{ width: "36rem" }}>
          <Card.Img variant="top" src={require("./rick.jpg")} />
          <Card.Body>
            <Card.Title>Bio</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>{this.props.credentials.userName}</ListGroup.Item>
            <ListGroup.Item>{this.props.credentials.userEmail}</ListGroup.Item>
            <ListGroup.Item>Another Info</ListGroup.Item>
          </ListGroup>
          <Card.Body>
            <Card.Link href="#">
              <Users users={this.props.users} />
            </Card.Link>
            <Card.Link href="#">
              <Button style={myCredentials} variant="outline-success" size="sm">
                Follows
              </Button>
            </Card.Link>
            <Card.Link href="#">
              <Button
                style={myCredentials}
                variant="outline-danger"
                size="sm"
                onClick={this.handleUpdateClick}
              >
                Update Info
              </Button>
            </Card.Link>
          </Card.Body>
        </Card>
      );
    }
  }
  handleUpdateClick = () => {
    console.log("Efe hello");
    this.setState({ updateClicked: !this.state.updateClicked });
  };
}

ProfileArea.propTypes = {
  //username: PropTypes.string.isRequired,
  //emailAddress: PropTypes.string.isRequired
};

export default ProfileArea;
