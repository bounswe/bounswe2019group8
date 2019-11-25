import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./traderNavbar.css";
import axios from "axios";
import {
  Button,
  Form,
  Navbar,
  Nav,
  NavDropdown,
  FormControl
} from "react-bootstrap";
import { withRouter } from "react-router-dom";

class GuestNavbar extends Component {
  state = {};

  render() {
    localStorage.setItem("userId", "null");
    localStorage.setItem("followings", "null");
    localStorage.setItem("userToken", "null");
    localStorage.setItem("userType", "null");
    return (
      <Navbar bg="dark" expand="lg">
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
            <Nav.Link href="">Trading Equipment</Nav.Link>
            <Nav.Link href="">Events</Nav.Link>
            <Nav.Link href="">Articles</Nav.Link>
          </Nav>
          <Button
            id="loginStyles"
            class="myButton"
            onClick={() => this.signUpClick()}
            variant="outline-success"
          >
            Sign Up
          </Button>

          <Button
            id="loginStyles"
            class="myButton"
            onClick={() => this.loginClick()}
            variant="outline-success"
          >
            Login
          </Button>
          {/* <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>*/}
        </Navbar.Collapse>
      </Navbar>
    );
  }
  signUpClick = () => {
    this.props.history.push("/signup");
  };
  loginClick = () => {
    this.props.history.push("/login");
  };


  componentDidMount() {
    
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
   
    var threeDaysEventsList = [];

    //we get the dates of 3 days to request upcoming events
    var today = new Date();
    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    var thirdDay = new Date(tomorrow);
    thirdDay.setDate(thirdDay.getDate() + 1);

    var todaydd = String(today.getDate()).padStart(2, '0');
    var todaymm = String(today.getMonth() + 1).padStart(2, '0');
    var todayyyyy = today.getFullYear();

    var tomorrowdd = String(tomorrow.getDate()).padStart(2, '0');
    var tomorrowmm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    var tomorrowyyyy = tomorrow.getFullYear();

    var thirdDaydd = String(thirdDay.getDate()).padStart(2, '0');
    var thirdDaymm = String(thirdDay.getMonth() + 1).padStart(2, '0');
    var thirdDayyyyy = thirdDay.getFullYear();

    today = todayyyyy + "-" + todaymm + "-" + todaydd;
    tomorrow = tomorrowyyyy + "-" + tomorrowmm + "-" + tomorrowdd;
    thirdDay = thirdDayyyyy + "-" + thirdDaymm + "-" + thirdDaydd;

    axios
    .get("http://8.209.81.242:8000/events/" + today).then(res => {
      var eventsList = res.data;
      console.log(eventsList.length);
      if(eventsList.length === 0){
        axios
        .post("http://8.209.81.242:8000/events/" + today).then(res => {
        });
        axios
        .get("http://8.209.81.242:8000/events/" + today).then(res => {
          eventsList = res.data;
          threeDaysEventsList = eventsList;
        }
        );
      }
      threeDaysEventsList = eventsList;
    }
    );
    axios
    .get("http://8.209.81.242:8000/events/" + tomorrow).then(res => {
      var eventsList = res.data;
      if(eventsList.length === 0){
        axios
        .post("http://8.209.81.242:8000/events/" + tomorrow).then(res => {
        });
        axios
        .get("http://8.209.81.242:8000/events/" + tomorrow).then(res => {
          eventsList = res.data;
          threeDaysEventsList = threeDaysEventsList.concat(eventsList);
        }
        );
      }
      threeDaysEventsList = threeDaysEventsList.concat(eventsList);
      console.log(threeDaysEventsList);
      console.log(eventsList);
    }
    );
    axios
    .get("http://8.209.81.242:8000/events/" + thirdDay).then(res => {
      var eventsList = res.data;
      if(eventsList.length === 0){
        axios
        .post("http://8.209.81.242:8000/events/" + thirdDay).then(res => {
        });
        axios
        .get("http://8.209.81.242:8000/events/" + thirdDay).then(res => {
          eventsList = res.data;
          threeDaysEventsList = threeDaysEventsList.concat(eventsList);
          localStorage.setItem("threeDaysEventsList", JSON.stringify(threeDaysEventsList));
        }
        );
      }
      threeDaysEventsList = threeDaysEventsList.concat(eventsList);
      localStorage.setItem("threeDaysEventsList", JSON.stringify(threeDaysEventsList));
    }
    );
  }
}

export default withRouter(GuestNavbar);
