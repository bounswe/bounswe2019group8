import React from "react";
import { Button, Card, ListGroup} from "react-bootstrap";
import UpdateCredentials from "./UpdateCredentials";
class ProfileArea extends React.Component {
  state = { updateClicked: false };
  render() {
    const myCredentials = {
      margin: 10
    };
    if (this.state.updateClicked === true) {
      return (
        <Card style={{ width: "36rem", align: 'center' }} >

          <Card.Body>
              <UpdateCredentials
                  credentials = {this.props.credentials}
                  api={this.props.api}
                style={myCredentials}
                variant="outline-danger"
                size="sm"
              >
                Update Info
              </UpdateCredentials>
          </Card.Body>
        </Card>
      );
    } else {
      return (
        <Card style={{ width: "36rem", align: "center" }}>
          <Card.Img variant="top" src={require("./rick.jpg")} />
          <ListGroup className="list-group-flush">
            <ListGroup.Item>{this.props.credentials.firstName + " " + this.props.credentials.lastName}</ListGroup.Item>
            <ListGroup.Item>{this.props.credentials.userEmail}</ListGroup.Item>
            <ListGroup.Item>{this.props.credentials.dateOfBirth}</ListGroup.Item>
          </ListGroup>
          <Card.Body>
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
    this.setState({ updateClicked: !this.state.updateClicked });
  };
}

ProfileArea.propTypes = {
  //username: PropTypes.string.isRequired,
  //emailAddress: PropTypes.string.isRequired
};

export default ProfileArea;
