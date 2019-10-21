import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import "./Login.css";
import axios from "axios";

export default function Login({ loginSuccess, api, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);
    let success = false;
    api
      .post("auth_tokens", {
        email: fields.email,
        password: fields.password
      })
      .then(response => {
        console.log(response);
        if (response.statusText === "OK") {
          success = true;
          loginSuccess(response.data.user_id, response.data.token);
        }
      })
      .catch(function(error) {
        alert(error.message);
        setIsLoading(false);
      })
      .finally(response => {
        // console.log(response);
      });

    /*
    if (success) {
      loginSuccess();
    }
    else {
      try {
        await Auth.signIn(fields.email, fields.password);
        props.userHasAuthenticated(true);
        props.history.push("/");
      } catch (e) {
        alert(e.message);
        setIsLoading(false);
      }
    }*/
  }

  return (
    <div className="Login">
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
        <FormGroup controlId="password" bsSize="large">
          <FormLabel>Password</FormLabel>
          <FormControl
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </form>
    </div>
  );
}
