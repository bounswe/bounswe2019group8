import React, { useState } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import "./UpdateCredentials.css";

export default function UpdateCredentials({ api, ...props }) {
  const [fields, handleFieldChange] = useFormFields({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  function validateForm() {
    return (
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }
  async function handleSubmit(event) {
      event.preventDefault();

      setIsLoading(true);

      var url = "http://8.209.81.242:8000/users/" + this.props.credentials.id;

      api.put(url,
          {
              first_name: fields.firstName,
              last_name: fields.lastName,
              email: fields.email,
              date_of_birth: fields.dateOfBirth,
              password: fields.password
          }, { headers: { Authorization: `Token ${this.props.credentials.token}` } })
          .then(function(response) {
              alert("update successful");
          })
          .catch(function(error) {
              alert("failed update");
              console.log(error);
          });
    setIsLoading(false);
  }

  /* async function handleConfirmationSubmit(event) {
        event.preventDefault();

        setIsLoading(true);
    }

  /*  function renderConfirmationForm() {
        return (
            <form onSubmit={handleConfirmationSubmit}>
                <FormGroup controlId="confirmationCode" bsSize="large">
                    <FormLabel>Confirmation Code</FormLabel>
                    <FormControl
                        autoFocus
                        type="tel"
                        onChange={handleFieldChange}
                        value={fields.confirmationCode}
                    />
                    <FormText>Please check your email for the code.</FormText>
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    isLoading={isLoading}
                    disabled={!validateConfirmationForm()}
                >
                    Verify
                </LoaderButton>
            </form>
        );
    }*/

  function renderForm() {
    return (
      <form onSubmit={handleSubmit}>
          <FormGroup controlId="firstName" bsSize="large">
              <FormLabel>First Name</FormLabel>
              <FormControl
                  autoFocus
                  type="firstName"
                  value={fields.firstName}
                  onChange={handleFieldChange}
              />
          </FormGroup>
          <FormGroup controlId="lastName" bsSize="large">
              <FormLabel>Last Name</FormLabel>
              <FormControl
                  autoFocus
                  type="lastName"
                  value={fields.lastName}
                  onChange={handleFieldChange}
              />
          </FormGroup>
        <FormGroup controlId="email" bsSize="large">
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="dateOfBirth" bsSize="large">
          <FormLabel>Date Of Birth</FormLabel>
          <FormControl
            type="dateOfBirth"
            value={fields.dateOfBirth}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <FormLabel>Password</FormLabel>
          <FormControl
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
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
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Update Credentials
        </LoaderButton>
      </form>
    );
  }

  return (
      <div className="UpdateCredentials">
        {renderForm()}
     </div>);
    }
