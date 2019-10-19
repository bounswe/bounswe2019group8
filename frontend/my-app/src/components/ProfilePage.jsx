// src/containers/ProfilePage.js

import React, { PropTypes } from "react";
import ProfileArea from "./ProfileArea";

class ProfilePage extends React.Component {
  render() {
    return (
      <div>
        <ProfileArea
          credentials={this.props.credentials}
          follows={this.props.follows}
        />
      </div>
    );
  }
}

ProfilePage.propTypes = {};

export default ProfilePage;
