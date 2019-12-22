import React from "react";
import { Button, Card, ListGroup, Row, Col } from "react-bootstrap";
import UpdateCredentials from "./UpdateCredentials";
import "./ProfileArea.css";
import axios from "axios";
import { withRouter } from "react-router-dom";

import { AiFillCamera } from "react-icons/ai";
import { FaCameraRetro } from 'react-icons/fa'
import { MdDelete, MdFileUpload } from 'react-icons/md'
import FormData from 'form-data'



class OwnProfileArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading:false,
      picture: null,
      pictureName: '',
      imgPreviewUrl: '',
      updateClicked: false,
      credentials: {},
      imageUploadMenu: false,
      api: axios.create({
        baseURL: "http://8.209.81.242:8000/"
      }),
      users: [],
      me: { followings: [], followers: [] }
    };
    this.handleImageChange = this.handleImageChange.bind(this);

  }
  componentDidMount() {
    this.setState({
      isLoading: true
    })
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
        headers: { 'Content-Type':'multipart/form-data', Authorization: `Token ${token}` }
      })
      .then(res => {
        this.setState({ users: res.data });
      });
    axios
      .get(url, { headers: { Authorization: `Token ${token}` } })
      .then(res => {

        var credentials = { ...this.state.credentials };
        credentials.profileImageUrl = res.data.profile_image;
        credentials.userEmail = res.data.email;
        credentials.firstName = res.data.first_name;
        credentials.lastName = res.data.last_name;
        credentials.dateOfBirth = res.data.date_of_birth;
        credentials.id = id;
        credentials.userToken = token;
        credentials.userGroup = res.data.groups[0];
        this.setState({ credentials: credentials });
      });
      this.setState({
        isLoading:false,
      })

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

  handleImageMenu() {
    let imageUploadState = this.state.imageUploadMenu
    this.setState({
      imageUploadMenu: !imageUploadState
    })
  }

  handleImageSubmit = (e) => {
    e.preventDefault()
    this.setState({
      isLoading:true
    })
    let data = new FormData();

    data.append('profile_image', this.state.picture)
    let url = 'http://mercatus.xyz:8000/users/' + this.state.credentials.id
    axios.put(url, data, {
      headers: {
        'Authorization': `Token ${this.state.credentials.userToken}`,
        'Content-Type': 'multipart/form-data'
    }})
    this.componentDidMount();
  }

  handleImageChange = (e) => {
    this.setState({
      picture: e.target.files[0],
      pictureName: e.target.files[0].name.substr(0,5) + '...'
    })

  };

  render() {
    const myCredentials = {
      margin: 10
    };

    let finalUrl = this.state.credentials.profileImageUrl ? ('http://mercatus.xyz:8000' + this.state.credentials.profileImageUrl)
    : require("../images/default_profile_picture.png");

    let imageComp =
    (this.state.isLoading) ? <div style={{margin:'auto', fontSize:26}}>Uploading...</div> : <Card.Img variant="top" src={finalUrl} />

    let addImageMenu = <div></div>
    if (this.state.imageUploadMenu) {
      addImageMenu =
        <div style={{ margin: 'auto', width: '100%', fontSize: 14, marginBottom: 8, padding:22 }}>
          <form onSubmit={this.handleImageSubmit}>
            <div style={{float:'left'}}>

              <label for="file-upload" class="imageButton">
                CHOOSE FILE
            </label>
              <input onChange={this.handleImageChange} style={{ float:'left' }} className='file' id='file-upload' type="file" />
              <div style={{padding:6, float:'right', overflow:'hidden' }}>
                {
                  this.state.pictureName
                }
              </div>
            </div>
            <button type='submit' style={{ float:'right' }} className='imageButton'>
              <MdFileUpload ></MdFileUpload>
              UPLOAD
            </button>
          </form>
        </div>
    }

    return (
      <Row>
        <Col xs={{ offset: 4, span: 4 }}>
          <Card style={{ backgroundColor: "#FFF", width: "100%", padding: 20 }}>
            {imageComp}
            <Row style={{ padding: 5, margin: 5, justifyContent: 'center', backgroundColor: '#009688' }}>
              <FaCameraRetro onClick={() => this.handleImageMenu()} className='icon' style={{ marginRight: 12 }}></FaCameraRetro>
              <MdDelete className='icon'></MdDelete>
            </Row>
            <Row>
              {addImageMenu}
            </Row>
            {


            }
            <ListGroup className="list-group-flush">
              <ListGroup.Item action href="/followers" className="my-follow">

                My Followers
                      </ListGroup.Item>
              <ListGroup.Item action href="/followings" className="my-follow">
                My Followings

            </ListGroup.Item>
              <ListGroup.Item action href={"/profile/" + localStorage.getItem("userId") + "/articles"} className="my-follow">

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
        </Col>
      </Row>

    );
  }
  handleUpdateClick = () => {
    this.setState({ updateClicked: !this.state.updateClicked });
  };
  followingsClick = () => {
    this.props.history.push("/followings")
  }
}


export default withRouter(OwnProfileArea);
