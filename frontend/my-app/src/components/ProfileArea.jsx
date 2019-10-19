import React, { PropTypes, useState } from "react";
import { Button, Card, ListGroup, Modal } from "react-bootstrap";
import Followers from "./Followers";
class ProfileArea extends React.Component {
  render() {
    const updateCredentials = {
      margin: 10
    };
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
            <Followers follows={this.props.follows} />
          </Card.Link>
          <Card.Link href="#">
            <Button
              style={updateCredentials}
              variant="outline-danger"
              size="sm"
            >
              Update Info
            </Button>
          </Card.Link>
        </Card.Body>
      </Card>
    );
  }
}

ProfileArea.propTypes = {
  //username: PropTypes.string.isRequired,
  //emailAddress: PropTypes.string.isRequired
};

export default ProfileArea;
