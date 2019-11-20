import React from "react";
import ProfileArea from "./ProfileArea";

class ProfilePage extends React.Component {
  render() {
    return (
      <div>
        <ProfileArea
          credentials={this.props.credentials}
          users={this.props.users}
        />
      </div>
    );
  }
}

ProfilePage.propTypes = {};

export default ProfilePage;
