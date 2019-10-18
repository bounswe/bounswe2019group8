import React, { PropTypes } from "react";
import { Button } from "react-bootstrap";

class ProfileArea extends React.Component {
  render() {
    const updateCredentials = {
      margin: 10
    };
    return (
      <div>
        <h1>{this.props.credentials.userName}</h1>
        <h1>{this.props.credentials.userEmail}</h1>
        <Button style={updateCredentials} variant="outline-success">
          Update Credentials
        </Button>
      </div>
    );
  }
}

ProfileArea.propTypes = {
  //username: PropTypes.string.isRequired,
  //emailAddress: PropTypes.string.isRequired
};

export default ProfileArea;
