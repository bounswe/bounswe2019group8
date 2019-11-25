import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./traderNavbar.css";

import WriteArticlePage from "../article_components/writeArticlePage";
import ArticleHolder from "../article_components/articleHolder";
import WholeArticlePage from "../article_components/wholeArticlePage";
import { FaSignOutAlt, FaListAlt, FaUserCircle, FaSearchDollar } from "react-icons/fa";
import { MdSettings, MdChromeReaderMode } from "react-icons/md";

import {
  Button,
  Form,
  Navbar,
  Nav,
  NavDropdown,
  FormControl
} from "react-bootstrap";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Followings from "../profile_components/followings";

class TraderNavbar extends Component {
  state = { credentials: {}, searchText: "" };
  changeHandler = event => {
    this.setState({
      searchText: event.target.value
    });
  };
  render() {
    return (
      <div>
        <Navbar bg="dark" expand="lg" >
          <Navbar.Brand href="/" className="navBarSyles">
            <img
              src={require("../images/MERCATUS-LOGO72DP.png")}
              height="50"
              weight="70"
              alt="mercatus"
            />
          </Navbar.Brand>
          <Navbar.Toggle
            class="navbar-toggler"
            aria-controls="basic-navbar-nav"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/treq">Trading Equipment</Nav.Link>
              <Nav.Link href="#">Events</Nav.Link>
              <Nav.Link href="/articles">Articles</Nav.Link>
            </Nav>
            <Form inline>
              <FormControl
                type="text"
                value={this.state.searchText}
                placeholder="..."
                className="mr-sm-2"
                id = 'searchBar'
                onChange={this.changeHandler}
              />
              <Button id='searchButton' href={"/search/" + this.state.searchText} variant="outline-success">
                Search
                <FaSearchDollar style={{marginLeft: 6}}></FaSearchDollar>

              </Button>
            </Form>
            <NavDropdown

              title={
                this.state.credentials.firstName +
                " " +
                this.state.credentials.lastName + "  "
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item href="#" onClick={() => this.profileClick()}>
                <FaUserCircle style={{marginRight:10 }}></FaUserCircle>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item href="#" onClick={() => this.articleClick()}>
                <MdChromeReaderMode style={{marginRight: 10}}></MdChromeReaderMode>
                Articles
              </NavDropdown.Item>
              <NavDropdown.Item href="#">
                <MdSettings style={{marginRight: 10}}></MdSettings>
                Settings
              </NavDropdown.Item>
              <NavDropdown.Item href="#">
                <FaListAlt style={{marginRight: 10}}></FaListAlt>
                Portfolio
              </NavDropdown.Item>

              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => this.logoutClick()}>
                <FaSignOutAlt style={{ marginRight: 10 }} />
                Logout
              </NavDropdown.Item>

            </NavDropdown>
            <img
              className="rounded-circle profileImage"
              src={require("../images/rick.jpg")}
              size="sm"
              alt="10x10"
              width="60"
              height="55"
            />
            {/* <Form inline>
              <FormControl type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-success">Search</Button>
            </Form>*/}
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
  profileClick = () => {
    this.props.history.push("/login");
    this.props.history.push("/profile/" + localStorage.getItem("userId"));
  };
  articleClick = () => {
    this.props.history.push("/login");
    this.props.history.push("/profile/" + localStorage.getItem("userId") + "/articles");
  }
  logoutClick = () => {
    localStorage.setItem("userId", null);
    localStorage.setItem("userToken", null);
    localStorage.setItem("userGroup", null);
    localStorage.setItem("followings", null);
    localStorage.setItem("articleList", null);
    localStorage.setItem("equipmentList", null);
    this.props.history.push("/login");
  };
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
      .get("http://8.209.81.242:8000/users", {
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
        credentials.userToken = token;
        credentials.userGroup = res.data.groups[0];
        this.setState({ credentials: credentials });
      });

    axios.get("http://8.209.81.242:8000/trading_equipments").then(res => {
      var equipmentList = res.data;
      localStorage.setItem("equipmentList", JSON.stringify(equipmentList));
    });
    axios
      .get("http://8.209.81.242:8000/articles").then(res => {
        var articleList2 = res.data;
        localStorage.setItem("articleList", JSON.stringify(articleList2));
      }

      );
  }
}

export default withRouter(TraderNavbar);
