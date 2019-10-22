import React from "react";
import { Button, Card, ListGroup} from "react-bootstrap";
import Users from "./Users";
import UpdateCredentials from "./UpdateCredentials";
class ProfileArea extends React.Component {

  constructor() {
    super();

    this.state = {
       updateClicked: false
    };
  }

  componentDidMount() {
    console.log(this.props);
    this.updateMe();
  }

  follow(id) {
    console.log('follow');
    console.log(id);

    this.props.api.post(`users/${this.props.credentials.id}/followings/${id}`, { headers: { Authorization: `Token ${this.props.credentials.userToken}` } },
      {
       following_pk: id,
     })
      .then(response => {
        console.log(response);


          console.log('xxx');
          console.log(this.state);
          console.log(id);
          const me = {
            ...this.state.me,
            followings: this.state.me.followings.filter(x => x.pk != id)
          }

          this.setState({ me: me });
      })
  }

  unfollow(id) {
    this.props.api.delete(`users/${this.props.credentials.id}/followings/${id}`, { headers: { Authorization: `Token ${this.props.credentials.userToken}` } })
      .then(response => {
        console.log(response);


          console.log('xxx');
          console.log(this.state);
          console.log(id);
          const me = {
            ...this.state.me,
            followings: this.state.me.followings.filter(x => x.pk != id)
          }

          this.setState({ me: me });
      })
  }

  updateMe() {
    this.props.api.get(`users/${this.props.credentials.id}`, { headers: { Authorization: `Token ${this.props.credentials.userToken}` } })
      .then(response => {
        console.log(response);

        if (response.statusText === "OK") {
          this.setState({ me: response.data });


        }
      })
  }

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

            <ListGroup.Item>
              Followers:
              <ListGroup className="list-group-flush">
                {this.state.me && this.state.me.followers.map((f,i) => <div key={f.pk}>{i + 1} - {`${f.first_name} ${f.last_name}`}</div>)}

              </ListGroup>
            </ListGroup.Item>

            <ListGroup.Item>
              Followed by me:
              <ListGroup className="list-group-flush">
                {this.state.me && this.state.me.followings.map((f,i) => <div key={f.pk}>
                {i + 1} - {`${f.first_name} ${f.last_name}`}

                 <Button onClick={() => this.unfollow(f.pk)}>Unfollow</Button>
                 </div>)}

              </ListGroup>
            </ListGroup.Item>

            <ListGroup.Item>
            <ListGroup>
              Other users you can follow:
              {this.props.users.map(users1 => (
                <ListGroup.Item
                  action
                  variant="info"
                  key={users1.id}
                  users={users1}
                >
                  {users1.first_name + " " + users1.last_name}
                  <button style={{margin: "10px"}} onClick={() => this.follow(users1.pk)}>Follow</button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            </ListGroup.Item>
          </ListGroup>
          <Card.Body>
              <Card.Link href="#">

              </Card.Link>
              <Card.Link href="#">

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
    this.setState({ updateClicked: !this.state.updateClicked });
  };
}

ProfileArea.propTypes = {
  //username: PropTypes.string.isRequired,
  //emailAddress: PropTypes.string.isRequired
};

export default ProfileArea;
