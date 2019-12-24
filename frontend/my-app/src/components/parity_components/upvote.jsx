import React, { Component } from "react";
import { Route } from "react-router-dom";
import "../profile_components/ProfileArea.css";
import axios from "axios";
import { Button, Card, ListGroup } from "react-bootstrap";
import { GoArrowUp } from "react-icons/go"


class UpVote extends Component {
  state = {
    api: axios.create({
      baseURL: "http://8.209.81.242:8000/"
    }),
    likeCount: 0
  };
  componentWillMount() {
    let count = 0
    axios
      .get("http://8.209.81.242:8000/trading_equipments/" + this.props.commentPk + "/predictions/upvotes", {
        headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
      })
      .then(res => {
        res.data.forEach((element) => {
          this.props.incRating()

          if (element.predictor.toString() === localStorage.getItem("userId")) {
            this.props.makeLike();
          }

        });

      });


  }

  like = () => {
    var tempList = []
    var token = localStorage.getItem("userToken");
    console.log(token)
    this.state.api
      .delete("http://8.209.81.242:8000/trading_equipments/" + this.props.commentPk + "/predictions/downvotes", {
        headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
      })
      .then(response => {
        if (response.data === 200) {
          this.props.incRating()
        }
      });

    axios
      .post("http://8.209.81.242:8000/trading_equipments/" + this.props.commentPk + "/predictions/upvotes", {},
        {
          headers: { Authorization: `Token ${token}` }
        }
      )
      .then(response => {
        axios
          .get("http://8.209.81.242:8000/trading_equipments/" + this.props.commentPk + "/predictions/upvotes", {
            headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
          })
          .then(res => {
            res.data.forEach((element) => {
              if (element.predictor.toString() === localStorage.getItem("userId")) {
                this.props.makeLike();
              }
            });

          });

        this.props.incRating()

      });
  }
  unlike = () => {

    this.state.api
      .delete("http://8.209.81.242:8000/trading_equipments/" + this.props.commentPk + "/predictions/upvotes", {
        headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
      })
      .then(response => {
        axios
          .get("http://8.209.81.242:8000/trading_equipments/" + this.props.commentPk + "/predictions/upvotes", {
            headers: { Authorization: `Token ${localStorage.getItem("userToken")}` }
          })
          .then(res => {
            var count = 0
            res.data.forEach((element) => {
              if (element.predictor.toString() === localStorage.getItem("userId")) {
                count = count + 1
              }
            });
            if (count === 0) {
              this.props.makeNeutral();
            }
            this.props.decRating()

          });
      });

  }
  render() {

    if (this.props.likeState === 1) {
      return (
        <React.Fragment>

          <GoArrowUp style={{ marginRight: 10, color: "#3C3C3C", fontSize: "20px" }} onClick={() => this.unlike()} />
        </React.Fragment>
      )
    }
    else {
      return (
        <React.Fragment>

          <GoArrowUp style={{ marginRight: 10, color: "#A4A4A4", fontSize: "20px" }} onClick={() => this.like()} />

        </React.Fragment>)

    }


  }
}
export default UpVote;
