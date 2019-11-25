import React, { useState } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../../containers/LoaderButton";
import { useFormFields } from "../../libs/hooksLib";
import "./UpdateCredentials.css";
import axios from "axios";

export default function UpdateCredentials({ ...props }) {
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

      var url = "http://8.209.81.242:8000/users/" + localStorage.getItem("userId");
      var userEmail = "";
      var userPassword = "";
      var userDateOfBirth = "";
      axios.get(url, { headers: { Authorization: `Token ${localStorage.getItem("userToken")}` } })
      .then(function(response){
        console.log(response.data);
        if(fields.email === ""){
          userEmail = response.data.email;
        }
        else{
         userEmail = fields.email;
        }
        if(fields.dateOfBirth === ""){
          userEmail = response.data.date_of_birth;
        }else{
          userDateOfBirth = fields.dateOfBirth;
        }
      });
      console.log(userEmail);
      if(fields.password!==""){
       
        axios.put(url,
          {
              email: userEmail,
              date_of_birth: userDateOfBirth,
              password: fields.password
          }, { headers: { Authorization: `Token ${localStorage.getItem("userToken")}` } })
          .then(function(response) {
              alert("update successful");
          })
          .catch(function(error) {
              alert("failed update");
              console.log(error);
          });
      }else{
        axios.put(url,
          {
            date_of_birth: userDateOfBirth,
              email: userEmail
          }, { headers: { Authorization: `Token ${localStorage.getItem("userToken")}` } })
          .then(function(response) {
              alert("update successful");
          })
          .catch(function(error) {
              alert("failed update");
              console.log(error);
          });
      }
     
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
