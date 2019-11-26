import React from "react";
import { Button, Card, ListGroup, Row, Col } from "react-bootstrap";
import UpdateCredentials from "./UpdateCredentials";
import "./ProfileArea.css";
import axios from "axios";
class ProfileArea extends React.Component {
  constructor() {
    super();

    this.state = {
      updateClicked: false,
      credentials:{},
      api: axios.create({
        baseURL: "http://8.209.81.242:8000/"
      }),
      users:[],
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
    .get(`users/${localStorage.getItem("userId")}/followings/`, {
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
      credentials.userGroup = res.data.groups[0];
      this.setState({ credentials: credentials });
    });
  }
  follow(user) {
    let id = user.pk;
    axios
      .post(
        `users/${this.state.credentials.id}/followings`,
        {
          following_pk: id
        },
        {
          headers: {
            Authorization: `Token ${this.state.credentials.userToken}`
          }
        }
      )
      .then(response => {
        const me = {
          ...this.state.me,
          followings: [...this.state.me.followings, user]
        };

        this.setState({ me: me });
      });
  }

  unfollow(id) {
    axios
      .delete(`users/${this.state.credentials.id}/followings/${id}`, {
        headers: { Authorization: `Token ${this.state.credentials.userToken}` }
      })
      .then(response => {
        const me = {
          ...this.state.me,
          followings: this.state.me.followings.filter(x => x.pk !== id)
        };

        this.setState({ me: me });
      });
  }

  updateMe() {
    axios
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
    if (this.state.updateClicked === true) {
      return (
        <Card style={{ width: "36rem", align: "center" }}>
          <Card.Body>
            <UpdateCredentials
              credentials={this.props.credentials}
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
      console.log("hiii");
      return (
        <Row>
        <Col xs={6}>
        <Card>
          <Card.Img variant="top" src={require("../images/rick.jpg")} />
          <ListGroup className="list-group-flush" style={{backgroundColor: "#FFF"}}>
            <ListGroup.Item>
              {this.state.credentials.firstName +
                " " +
                this.state.credentials.lastName}
            </ListGroup.Item>
            <ListGroup.Item>{this.state.credentials.userEmail}</ListGroup.Item>
            <ListGroup.Item>
              {this.state.credentials.dateOfBirth}
            </ListGroup.Item>
            <ListGroup.Item>
              Followers:
              <ListGroup className="list-group-flush">
                {this.state.me &&
                  this.state.me.followers.map((f, i) => (
                    <div key={f.pk}>
                      {i + 1} - {`${f.first_name} ${f.last_name}`}
                    </div>
                  ))}
              </ListGroup>
            </ListGroup.Item>
            <ListGroup.Item>
              Followed by me:
              <ListGroup className="list-group-flush">
                {this.state.me &&
                  this.state.me.followings.map((f, i) => (
                    <div key={f.pk}>
                      {i + 1} - {`${f.first_name} ${f.last_name}`}
                      <button
                        class="myButton"
                        onClick={() => this.unfollow(f.pk)}
                      >
                        Unfollow
                      </button>
                    </div>
                  ))}
              </ListGroup>
            </ListGroup.Item>
            <ListGroup.Item>
              <ListGroup>
                Other users you can follow:
                {this.state.users.map(users1 => (
                  <ListGroup.Item
                    action
                    variant="info"
                    key={users1.id}
                    users={users1}
                  >
                    {users1.first_name + " " + users1.last_name}
                    <button
                      class="myButton"
                      style={{ margin: "10px" }}
                      onClick={() => this.follow(users1)}
                    >
                      Follow
                    </button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
          <Card.Body>
            <Card.Link href="#"></Card.Link>
            <Card.Link href="#"></Card.Link>
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
        </Col>
        </Row>
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
