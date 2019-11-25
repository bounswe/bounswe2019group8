import React, { useState } from "react";
import { FormGroup, FormControl, FormLabel, Button, Form, Col, Row, Nav, Tabs, Tab } from "react-bootstrap";

import LoaderButton from "./LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import "./Signup.css";
import CheckBox from "./checkBox";
import axios from "axios";

export default function Signup({ api, signUpSuccess, ...props }) {
  const [fields, handleFieldChange] = useFormFields({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: ""
  });
  const [traderFields, handleTraderFieldChange] = useFormFields({
    firstName: "",
    lastName: "",
    deteOfBirth: "",
    email: "",
    password: "",
    iban: "",
    address: "",
    confirmPassword: "",
    confirmationCode: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  var [trader, traderChecked] = useState(false);
  var [userLat, userLatFunc] = useState(0);
  var [userLong, userLongFunc] = useState(0);
  var [didComponentMount, didIt] = useState(false);

  function validateForm() {
    return (
      fields.firstName.length > 0 &&
      fields.lastName.length > 0 &&
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }
  function componentDidMount() {
    //didIt(true);
    var userAddress = traderFields.address;
    var userAddressForGoogle = userAddress.replace(/ /g, "+");
    //var userLat;
    //var userLng;
    axios
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: userAddress,
          key: "AIzaSyDuZfKf8HkUVrF0LlxT8bqFUdrIqbXtrHk"
        }
      })
      .then(res => {
        //console.log(res);
        console.log("lat is: " + res.data.results[0].geometry.location.lat);
        //console.log("lng is: " + res.data.results[0].geometry.location.lng);
        //userLat = res.data.results[0].geometry.location.lat;
        //userLng = res.data.results[0].geometry.location.lng;
        userLatFunc(res.data.results[0].geometry.location.lat);
        userLongFunc(res.data.results[0].geometry.location.lng);
        console.log("userLat: " + userLat);
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log("again: " + userLat);
  }
  function validateTraderForm() {
    // console.log("state: " + didComponentMount);
    // if (!didComponentMount) {
    //  componentDidMount();
    //}
    if (traderFields.iban.length === 26) {
      componentDidMount();
      console.log("state: " + didComponentMount);
    }
    return (
      traderFields.firstName.length > 0 &&
      traderFields.lastName.length > 0 &&
      traderFields.email.length > 0 &&
      traderFields.password.length > 0 &&
      traderFields.password === traderFields.confirmPassword &&
      traderFields.iban.length === 26 &&
      traderFields.address.length > 0
    );
  }
  function handleCheckTrader() {
    traderChecked(!trader);
  }
  async function handleBasicSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    axios
      .post("/users", {
        email: fields.email,
        first_name: fields.firstName,
        last_name: fields.lastName,
        date_of_birth: fields.dateOfBirth,
        password: fields.password,
        groups: [1]
      })
      .then(function (response) {
        alert("sign-up successful");
      })
      .catch(function (error) {
        alert("Try Again");
        console.log(error);
      });

    setIsLoading(false);
  }
  async function handleTraderSubmit(event) {
    //didIt(true);
    event.preventDefault();

    setIsLoading(true);
    componentDidMount();
    axios
      .post("/users", {
        email: traderFields.email,
        first_name: traderFields.firstName,
        last_name: traderFields.lastName,
        date_of_birth: traderFields.dateOfBirth,
        password: traderFields.password,
        iban: traderFields.iban,
        lat: userLat,
        long: userLong,
        groups: [1]
      })
      .then(function (response) {
        alert("sign-up successful");
      })
      .catch(function (error) {
        alert("Try Again");
        console.log(error);
      });

    setIsLoading(false);
  }

  function renderForm() {
    let constFields =
      <div >
        <FormGroup controlId="email" size="large">
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={traderFields.email}
            onChange={handleTraderFieldChange}
          />
        </FormGroup>
        <Form.Row>
          <Col>
            <FormGroup controlId="firstName" size="large">
              <FormLabel>First Name</FormLabel>
              <FormControl
                type="firstName"
                value={traderFields.firstName}
                onChange={handleTraderFieldChange}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup controlId="lastName" size="large">
              <FormLabel>Last Name</FormLabel>
              <FormControl
                type="lastName"
                value={traderFields.lastName}
                onChange={handleTraderFieldChange}
              />
            </FormGroup>
          </Col>
        </Form.Row>
        <FormGroup controlId="dateOfBirth" size="large">
          <FormLabel>Date Of Birth</FormLabel>
          <FormControl
            type="dateOfBirth"
            value={traderFields.dateOfBirth}
            onChange={handleTraderFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" size="large">
          <FormLabel>Password</FormLabel>
          <FormControl
            type="password"
            value={traderFields.password}
            onChange={handleTraderFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" size="large">
          <FormLabel>Confirm Password</FormLabel>
          <FormControl
            type="password"
            onChange={handleTraderFieldChange}
            value={traderFields.confirmPassword}
          />
        </FormGroup>
      </div>
    let traderOnlyFields =
      <div>
        <FormGroup controlId="address" size="large">
          <FormLabel>Address</FormLabel>
          <FormControl
            type="address"
            onChange={handleTraderFieldChange}
            value={traderFields.address}
          />
        </FormGroup>
        <FormGroup controlId="iban" size="large">
          <FormLabel>IBAN</FormLabel>
          <FormControl
            type="iban"
            onChange={handleTraderFieldChange}
            value={traderFields.iban}
          />
        </FormGroup>
      </div>

    return (
      <div style={{ marginTop: 12 }}>

        <div className='formWrapper'>

          <div style={{ backgroundColor: 'whitesmoke', padding: 30, borderWidth: 1, borderStyle: 'solid', borderColor: 'grey' }}>
            <Tabs defaultActiveKey="basic" style={{ justifyContent: 'center' }}>
              <Tab eventKey="basic" onEnter={handleCheckTrader} title="Basic Register">
                <h1>Basic User</h1>
                <form onSubmit={handleBasicSubmit}>
                  {constFields}
                  <LoaderButton
                    block
                    style={{ marginTop: 30, width:200 }}
                    type="submit"
                    size="sm"
                    variant='outline-primary'
                    isLoading={isLoading}
                    disabled={!validateForm()}>
                    Sign Up
                </LoaderButton>
                </form>
              </Tab>
              <Tab eventKey="trader" onEnter={handleCheckTrader} title="Trader Register" >
                <h1>Trader</h1>
                <form onSubmit={handleTraderSubmit}>

                  {constFields}
                  {traderOnlyFields}

                  <LoaderButton
                    block
                    style={{ marginTop: 30, width:200 }}
                    type="submit"
                    size="sm"
                    variant='outline-primary'
                    isLoading={isLoading}
                    disabled={!validateTraderForm()}
                  >
                    Sign Up
                </LoaderButton>
                </form>
              </Tab>
            </Tabs>


          </div>
        </div>
      </div>
    );


  }
  let form = renderForm()
  return <div>{form}</div>;
}
