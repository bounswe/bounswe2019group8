import React from "react";
import { Button, Card, ListGroup, Row, Col, Dropdown, DropdownButton, Modal, ModalBody, ModalFooter, Form, Badge } from "react-bootstrap";
import UpdateCredentials from "./UpdateCredentials";
import "./ProfileArea.css";
import axios from "axios";
import { withRouter } from "react-router-dom";
import AssetButtonHandler from "./assetButtonHandler";
import { AiFillCamera } from "react-icons/ai";
import { FaCameraRetro } from 'react-icons/fa'
import { MdDelete, MdFavorite, MdFileUpload, MdEmail } from 'react-icons/md'
import { FaBirthdayCake, FaMoneyBillWaveAlt, FaPlusSquare } from 'react-icons/fa'
import FormData from 'form-data'



class OwnProfileArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      assetsLoaded: false,
      recommendedArticles: [],
      assets: [],
      usersList: [],
      recommendedPortfolios: [],
      isLoading: false,
      picture: null,
      pictureName: '',
      imgPreviewUrl: '',
      updateClicked: false,
      credentials: {},
      imageUploadMenu: false,
      section: 'Select...',
      enteredCashValue: null,
      api: axios.create({
        baseURL: "http://8.209.81.242:8000/"
      }),
      users: [],
      showCashIn: false,
      me: { followings: [], followers: [] },
      profitLoss: null,

    };
    this.handleCashIn = this.handleCashIn.bind(this)
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleChangedCash = this.handleChangedCash.bind(this);
    this.handleInvestment = this.handleInvestment.bind(this);

  }
  componentDidMount() {
    this.setState({
      isLoading: true
    })

    if ((this.state.usersList.length) === 0) {
      var token = localStorage.getItem("userToken");
      axios.get("http://8.209.81.242:8000/users", {
        headers: { Authorization: `Token ${token}` }
      }).then((res) => {
        console.log("done");
        this.setState({ usersList: res.data });
      })

    }

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
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Token ${token}` }
      })
      .then(res => {
        this.setState({ users: res.data });
      });
    axios
      .get("/profit_loss", {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Token ${token}` }
      })
      .then(res => {
        this.setState({ profitLoss: res.data });
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
    axios.get('http://8.209.81.242:8000/articles/recommendations', {
      headers: { Authorization: `Token ${token}` }
    }).then(res => {
      this.setState({ recommendedArticles: res.data });
    });
    axios.get('http://8.209.81.242:8000/portfolios/recommendations', {
      headers: { Authorization: `Token ${token}` }
    }).then(res => {
      this.setState({ recommendedPortfolios: res.data });
    });
    axios.get('http://8.209.81.242:8000/users/' + localStorage.getItem("userId") + '/assets',
      {
        headers: { Authorization: `Token ${token}` }
      }).then(res => {
        this.setState({ assets: res.data, assetsLoaded: true });
      });
    this.setState({
      isLoading: false,
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
      isLoading: true
    })
    let data = new FormData();

    data.append('profile_image', this.state.picture)
    let url = 'http://mercatus.xyz:8000/users/' + this.state.credentials.id
    axios.put(url, data, {
      headers: {
        'Authorization': `Token ${this.state.credentials.userToken}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    this.componentDidMount();
  }



  getUserName(pk) {
    //console.log("getArticleOwner", this.state);
    const user = this.state.usersList.find(u => u.pk === pk);
    if (user)
      return `${user.first_name} ${user.last_name}`;
    else {
      return "";
    }
  }

  handleCashIn() {
    let status = this.state.showCashIn
    this.setState({
      showCashIn: !status
    })
  }

  handleChangedCash(e) {
    e.preventDefault()
    this.setState({
      enteredCashValue: e.target.value
    })
  }

  handleInvestment() {
    this.handleCashIn();
    let data = new FormData();
    let token = localStorage.getItem("userToken")
    data.append('amount', this.state.enteredCashValue)
    axios
      .post("http://8.209.81.242:8000/users/" + this.state.credentials.id + "/cash", data, {
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        window.location.reload();
      });
  }

  handleImageChange = (e) => {
    this.setState({
      picture: e.target.files[0],
      pictureName: e.target.files[0].name.substr(0, 5) + '...'
    })

  };

  render() {
    const myCredentials = {
    };
    let finalUrl = this.state.credentials.profileImageUrl ? ('http://mercatus.xyz:8000' + this.state.credentials.profileImageUrl)
      : require("../images/default_profile_picture.png");
    let imageComp =
      (this.state.isLoading) ? <div style={{ margin: 'auto', fontSize: 26 }}>Uploading...</div>
        : <Card.Img style={{ borderRadius: 36 }} variant="top" src={finalUrl} />


    let cashInModal =
      <Modal className='modal' centered show={this.state.showCashIn} animation={true} onHide={this.handleCashIn}>
        <Modal.Header closeButton >
          <Modal.Title>Add Cash</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 36 }}>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Amount</Form.Label>
              <Form.Control value={this.state.enteredCashValue}
                onChange={this.handleChangedCash}
                placeholder="(USD)" />
              <Form.Text className="text-muted">
                Our transactions are completely safe.
                Your payment amount: {this.state.enteredCashValue} USD's.
              </Form.Text>
            </Form.Group>
            <div
              onClick={this.handleInvestment}
              style={{
                cursor: 'pointer', float: 'right', backgroundColor: 'black', color: 'white',
                letterSpacing: 1.8, textAlign: 'center', borderRadius: 20, padding: 12
              }}>
              Invest
            </div>
          </Form>
        </Modal.Body>


        <ModalFooter >
        </ModalFooter>
      </Modal >

    let addImageMenu = <div></div>
    if (this.state.imageUploadMenu) {
      addImageMenu =
        <div style={{ margin: 'auto', width: '100%', fontSize: 14, marginBottom: 8, padding: 22 }}>
          <form onSubmit={this.handleImageSubmit}>
            <div style={{ float: 'left' }}>

              <label for="file-upload" class="imageButton">
                CHOOSE FILE
            </label>
              <input onChange={this.handleImageChange} style={{ float: 'left' }} className='file' id='file-upload' type="file" />
              <div style={{ padding: 6, float: 'right', overflow: 'hidden' }}>
                {
                  this.state.pictureName
                }
              </div>
            </div>
            <button type='submit' style={{ float: 'right' }} className='imageButton'>
              <MdFileUpload ></MdFileUpload>
              UPLOAD
            </button>
          </form>
        </div>
    }

    let profitLossText = "";

    if (this.state.profitLoss) {
      const { cash_uploaded,  currentWorth } = this.state.profitLoss;
      const profit =  Math.round((currentWorth - cash_uploaded)*100)/100;
      const color = profit >  0 ? "#0f0"  : "#f00";
      profitLossText = <div>You have deposited ${cash_uploaded} USD so far and your assets are currently worth {Math.round(currentWorth*100)/100} USD. Your net profit/loss so  far is <span style={{color}}>{profit}  USD</span> </div>;

    }

    const profitLossSection = (
      <Card style={{ width: '70%', padding: 40, margin: 'auto', float: 'left', marginTop: 10, backgroundColor: '#343a40' }}>
      <Row style={{ borderBottom: '1px solid white', paddingBottom: 12, color: 'white', letterSpacing: 7, fontSize: 20 }}>
        Profit Loss

      </Row>
      <Row style={{ color: 'white', padding: 20 }}>

      {profitLossText}

      </Row>
    </Card>
    );

    let articlesRecommendedSection =
      <Row style={{ marginTop: 40, height: 400, overflowY: 'scroll', overflowX: 'hidden' }}>
        {this.state.recommendedArticles.map(el =>
          <div display='inline'>
            <Card style={{

              backgroundColor: '#393f4d', display: 'inline-block', width: 120,
              width: '18rem', padding: 12
            }}>
              <Card.Body>
                <Card.Title
                  style={{
                    borderBottom: '1px solid white',
                    padding: 8,
                    color: 'white',
                    letterSpacing: 1.6, fontSize: 20
                  }}>
                  {el.title.substring(0, 18)}

                </Card.Title>

                <Card.Subtitle style={{ fontSize: 14 }} className="mb-2 ">by {this.getUserName(el.author)}</Card.Subtitle>
                <Card.Body style={{
                  marginBottom: 14,
                  marginTop: 24
                }}>

                </Card.Body>
                <Card.Link
                  style={{
                    border: '2px solid black', fontSize: 12, letterSpacing: 2, borderRadius: 18,
                    padding: 8,
                    paddingRight: 22, paddingLeft: 22,
                    color: 'white',
                    backgroundColor: 'black'
                  }}
                  href={"/articles/" + el.pk}>View Article
                        </Card.Link>
                <div style={{
                  borderRadius: 18,
                  fontSize: 14, float: 'right', backgroundColor: 'black', color: 'white',
                  padding: 3, paddingRight: 22, paddingLeft: 22,
                }}>
                  <MdFavorite style={{ color: 'red', marginRight: 8 }}></MdFavorite>
                  {el.rating}
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </Row>
    let portfoliosRecommendedSection =

      <Row style={{ marginTop: 40, height: 400, overflowY: 'scroll', overflowX: 'hidden' }}>
        {this.state.recommendedPortfolios.map(el =>
          <div display='inline'>
            <Card style={{

              backgroundColor: '#7dce94', display: 'inline-block', width: 120,
              width: '18rem', padding: 12
            }}>
              <Card.Body>
                <Card.Title
                  style={{
                    borderBottom: '1px solid white',
                    padding: 8,
                    color: 'white',
                    letterSpacing: 1.6, fontSize: 20
                  }}>
                  {el.name}

                </Card.Title>

                <Card.Subtitle style={{ fontSize: 14 }} className="mb-2 ">by {this.getUserName(el.owner)}</Card.Subtitle>
                <Card.Body style={{
                  marginBottom: 14,
                  marginTop: 24
                }}>
                  <FaMoneyBillWaveAlt style={{ color: 'white', marginRight: 5 }}></FaMoneyBillWaveAlt>
                  <a style={{ fontWeight: 'lighter', color: 'white' }}>{el.tr_eqs.length + ' trading equipments.'} </a>
                </Card.Body>
                <Card.Link
                  style={{
                    border: '2px solid black', fontSize: 12, letterSpacing: 2, borderRadius: 18,
                    padding: 8,
                    paddingRight: 22, paddingLeft: 22,
                    color: 'white',
                    backgroundColor: 'black'
                  }}
                  href={"/profile/" + el.owner + "/others_portfolio/" + el.pk}>View Portfolio
              </Card.Link>

              </Card.Body>
            </Card>
          </div>
        )}
      </Row>



    return (
      <Row>
        <Col>
          <Card style={{ float: 'left', minWidth: 420, marginLeft: 15, marginTop: 10, backgroundColor: '#343a40', padding: 20 }}>
            {imageComp}
            <Row style={{ backgroundColor: '#343a40', padding: 5, margin: 5, justifyContent: 'center' }}>
              <FaCameraRetro onClick={() => this.handleImageMenu()} className='icon' style={{ marginRight: 12 }}></FaCameraRetro>
              <MdDelete className='icon'></MdDelete>
            </Row>
            <Row>
              {addImageMenu}
            </Row>
            {
              cashInModal

            }
            <ListGroup className="list-group-flush">
              <div display='inline'>
                <ListGroup.Item style={{
                  background: 'none', color: 'white',
                  borderBottom: '1px solid white',
                  borderTop: '1px solid white',
                  letterSpacing: 1.8,
                  fontSize: 28, textAlign: 'center', marginBottom: 12
                }}>
                  {this.state.credentials.firstName +
                    " " +
                    this.state.credentials.lastName}
                </ListGroup.Item>
                <ListGroup.Item style={{
                  fontSize: 12,
                  letterSpacing: 1.5,
                  borderRight: '1px solid white', background: 'none', color: 'white',
                  borderRadius: 20, marginBottom: 12,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  marginRight: 8, display: 'inline-block'
                }}>
                  <MdEmail style={{ marginRight: 5 }}></MdEmail>
                  {this.state.credentials.userEmail}
                </ListGroup.Item>
                <ListGroup.Item style={{
                  fontSize: 12,
                  letterSpacing: 1.5,
                  background: 'none', color: 'white',
                  borderRadius: 20, marginBottom: 12, display: 'inline-block'
                }}>
                  <FaBirthdayCake style={{ marginRight: 5 }}></FaBirthdayCake>
                  {this.state.credentials.dateOfBirth}
                </ListGroup.Item>
              </div>
              <ListGroup.Item style={{ letterSpacing: 1.8, textAlign: 'center', borderRadius: 20, marginBottom: 12 }} action href="/followers" className="my-follow" >

                My Followers
                      </ListGroup.Item>
              <ListGroup.Item style={{ letterSpacing: 1.8, textAlign: 'center', borderRadius: 20, marginBottom: 12 }} action href="/followings" className="my-follow">
                My Followings

            </ListGroup.Item>
              <ListGroup.Item style={{ letterSpacing: 1.8, textAlign: 'center', borderRadius: 20, marginBottom: 42 }} action href={"/profile/" + localStorage.getItem("userId") + "/articles"} className="my-follow">

                Articles
            </ListGroup.Item>

              <ListGroup.Item style={{ backgroundColor: '#FFDC00', letterSpacing: 1.8, textAlign: 'center', borderRadius: 20 }} action href={"/upd_cred"} className="my-follow">
                Update Info
            </ListGroup.Item>


            </ListGroup>
            <Card.Body>

            </Card.Body>
          </Card>
          <Card style={{ width: '70%', padding: 40, margin: 'auto', float: 'left', marginTop: 10, backgroundColor: '#343a40' }}>
            <Row style={{ borderBottom: '1px solid white', paddingBottom: 12, color: 'white', letterSpacing: 7, fontSize: 20 }}>
              RECOMMENDED FOR YOU
              </Row>
            <Row>
              <DropdownButton variant='secondary' style={{ marginTop: 20 }} id="dropdown-basic-button" title={this.state.section}>
                <Dropdown.Item onClick={() => this.setState({ section: 'Articles' })}>Articles</Dropdown.Item>
                <Dropdown.Item onClick={() => this.setState({ section: 'Portfolios' })} >Portfolios</Dropdown.Item>
                <Dropdown.Item onClick={() => this.setState({ section: 'Select...' })}>Hide</Dropdown.Item>

              </DropdownButton>
            </Row>
            {this.state.section == 'Articles' ? articlesRecommendedSection :
              this.state.section == 'Portfolios' ? portfoliosRecommendedSection : null}
          </Card>
          {localStorage.getItem("userGroup") === "2" &&
            <Card style={{ width: '70%', padding: 40, margin: 'auto', float: 'left', marginTop: 10, backgroundColor: '#343a40' }}>
            <Row style={{ borderBottom: '1px solid white', paddingBottom: 12, color: 'white', letterSpacing: 7, fontSize: 20 }}>
              YOUR ASSETS
              <FaPlusSquare onClick={this.handleCashIn} style={{ marginLeft: 10 }}></FaPlusSquare>
            </Row>
            <Row style={{ color: 'white', padding: 20 }}>

              {
                (this.state.assetsLoaded) ?
                (this.state.assets.length < 1 ||
                  (this.state.assets.length == 1 && this.state.assets[0].amount <= 0)) ?
                  'You have no assets.' :
                  <ul>
                    {this.state.assets.map(el =>
                      <li  >
                        <AssetButtonHandler el={el}></AssetButtonHandler>

                      </li>
                    )}
                  </ul>



                : 'Loading...'
              }

            </Row>
          </Card>
          }

          {
            localStorage.getItem("userGroup") === "2" && profitLossSection
          }

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
