import React, { useState } from "react";
import { FormGroup, FormControl, FormLabel, InputGroup } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import "./Signup.css";
import CheckBox from "../components/checkBox";

export default function Signup({ api, signUpClicked, ...props }) {
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
    confirmPassword: "",
    confirmationCode: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  var [trader, traderChecked] = useState(false);

  function validateForm() {
    return (
      fields.firstName.length > 0 &&
      fields.lastName.length > 0 &&
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }
  function validateTraderForm() {
    return (
      traderFields.firstName.length > 0 &&
      traderFields.lastName.length > 0 &&
      traderFields.email.length > 0 &&
      traderFields.password.length > 0 &&
      traderFields.password === traderFields.confirmPassword &&
      traderFields.iban.length === 26
    );
  }
  function handleCheckTrader() {
    console.log("victory");
    traderChecked(!trader);
  }
  async function handleBasicSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    api
      .post("/users", {
        email: fields.email,
        first_name: fields.firstName,
        last_name: fields.lastName,
        date_of_birth: fields.dateOfBirth,
        password: fields.password
      })
      .then(function(response) {
        alert("sign-up successful");
        signUpClicked();
      })
      .catch(function(error) {
        alert("Try Again");
        console.log(error);
      });

    setIsLoading(false);
  }
  async function handleTraderSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    api
      .post("/users", {
        email: traderFields.email,
        first_name: traderFields.firstName,
        last_name: traderFields.lastName,
        date_of_birth: traderFields.dateOfBirth,
        password: traderFields.password,
        iban: traderFields.iban
      })
      .then(function(response) {
        alert("sign-up successful");
        signUpClicked();
      })
      .catch(function(error) {
        alert("Try Again");
        console.log(error);
      });

    setIsLoading(false);
  }

  function renderForm() {
    if (!trader) {
      return (
        <React.Fragment>
          <h1>Basic User SignUp</h1>
          <p>If you are a trader, check:</p>
          <CheckBox handleCheckTrader={handleCheckTrader}></CheckBox>
          <form onSubmit={handleBasicSubmit}>
            <FormGroup controlId="email" size="large">
              <FormLabel>Email</FormLabel>
              <FormControl
                autoFocus
                type="email"
                value={fields.email}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <FormGroup controlId="firstName" size="large">
              <FormLabel>First Name</FormLabel>
              <FormControl
                type="firstName"
                value={fields.firstName}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <FormGroup controlId="lastName" size="large">
              <FormLabel>Last Name</FormLabel>
              <FormControl
                type="lastName"
                value={fields.lastName}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <FormGroup controlId="dateOfBirth" size="large">
              <FormLabel>Date Of Birth</FormLabel>
              <FormControl
                type="dateOfBirth"
                value={fields.dateOfBirth}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <FormGroup controlId="password" size="large">
              <FormLabel>Password</FormLabel>
              <FormControl
                type="password"
                value={fields.password}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <FormGroup controlId="confirmPassword" size="large">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl
                type="password"
                onChange={handleFieldChange}
                value={fields.confirmPassword}
              />
            </FormGroup>

            <LoaderButton
              block
              type="submit"
              size="large"
              isLoading={isLoading}
              disabled={!validateForm()}
            >
              Signup
            </LoaderButton>
          </form>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <h1>Trader User SignUp</h1>
          <p>If you want to sign up as a basic user, uncheck:</p>
          <CheckBox handleCheckTrader={handleCheckTrader}></CheckBox>
          <form onSubmit={handleTraderSubmit}>
            <FormGroup controlId="email" size="large">
              <FormLabel>Email</FormLabel>
              <FormControl
                autoFocus
                type="email"
                value={traderFields.email}
                onChange={handleTraderFieldChange}
              />
            </FormGroup>
            <FormGroup controlId="firstName" size="large">
              <FormLabel>First Name</FormLabel>
              <FormControl
                type="firstName"
                value={traderFields.firstName}
                onChange={handleTraderFieldChange}
              />
            </FormGroup>
            <FormGroup controlId="lastName" size="large">
              <FormLabel>Last Name</FormLabel>
              <FormControl
                type="lastName"
                value={traderFields.lastName}
                onChange={handleTraderFieldChange}
              />
            </FormGroup>
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
            <FormGroup controlId="iban" size="large">
              <FormLabel>IBAN</FormLabel>
              <FormControl
                type="iban"
                onChange={handleTraderFieldChange}
                value={traderFields.iban}
              />
            </FormGroup>
            <LoaderButton
              block
              type="submit"
              size="large"
              isLoading={isLoading}
              disabled={!validateForm()}
            >
              Signup
            </LoaderButton>
          </form>
        </React.Fragment>
      );
    }
  }

  return <div className="Signup">{renderForm()}</div>;
}
