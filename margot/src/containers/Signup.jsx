import React, { useState } from "react";
import { Form, FormGroup, FormControl, FormLabel, Row, Container, Col, Card } from "react-bootstrap";
import LoaderButton from "./LoaderButton";
import { handleFormChange } from "../libs/FormHook";
import "./Signup.css";
import axios from "axios";
import {withRouter} from "react-router-dom";

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      dateOfBirth: "",

      email: "",
      password: "",
      passwordRepeat: "",

      location: "",
      iban: "",

      isTrader: false,
    };

    this.handleFormChange = handleFormChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.history.push("/profile");
  }

  render() {
    return (
      <Container fluid style={{padding: 10}}>
        <Row>
          <Col md={{offset: 3, span: 6}}>
            <Card className="text-left w-100">
              <Card.Body>
                <h3 className="card-title">Sign Up</h3>

                <Form onSubmit={this.handleSubmit}>
                  <FormGroup controlId="isTrader" size="large">
                    <FormLabel>Account Type</FormLabel>
                    <Form.Check
                      label="Sign up as a trader user"
                      onChange={this.handleFormChange} />
                  </FormGroup>

                  <FormGroup controlId="email" size="large">
                    <FormLabel>E-mail</FormLabel>
                    <FormControl
                      autoFocus
                      type="email"
                      required
                      value={this.state.email}
                      onChange={this.handleFormChange}
                    />
                  </FormGroup>

                  <FormGroup controlId="firstName" size="large">
                    <FormLabel>First Name</FormLabel>
                    <FormControl
                      type="text"
                      required
                      value={this.state.firstName}
                      onChange={this.handleFormChange}
                    />
                  </FormGroup>

                  <FormGroup controlId="lastName" size="large">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl
                      type="text"
                      required
                      value={this.state.lastName}
                      onChange={this.handleFormChange}
                    />
                  </FormGroup>

                  <FormGroup controlId="dateOfBirth" size="large">
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl
                      type="date"
                      required
                      value={this.state.dateOfBirth}
                      onChange={this.handleFormChange}
                    />
                  </FormGroup>

                  <FormGroup controlId="password" size="large">
                    <FormLabel>Password</FormLabel>
                    <FormControl
                      type="password"
                      required
                      value={this.state.password}
                      onChange={this.handleFormChange}
                    />
                  </FormGroup>

                  <FormGroup controlId="passwordRepeat" size="large">
                    <FormLabel>Repeat Password</FormLabel>
                    <FormControl
                      type="password"
                      value={this.state.passwordRepeat}
                      required
                      onChange={this.handleFormChange}
                    />
                  </FormGroup>

                  {this.state.isTrader && <FormGroup controlId="iban" size="large">
                    <FormLabel>IBAN</FormLabel>
                    <FormControl
                      type="text"
                      required
                      onChange={this.handleFormChange}
                      value={this.state.iban}
                    />
                  </FormGroup>}

                  <LoaderButton
                    block
                    type="submit"
                    size="large"
                    isLoading={this.state.isLoading}
                  >
                    Sign up
                  </LoaderButton>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(Signup);
