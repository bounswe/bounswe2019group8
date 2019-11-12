import React, { useState } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import "./Login.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import App from "../App";

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
    api
      .post("auth_tokens", {
        email: fields.email,
        password: fields.password
      })
      .then(response => {
        //console.log(response);
        if (response.statusText === "OK") {
          loginSuccess(response.data.user_id, response.data.token);
        }
      })
      .catch(function(error) {
        alert("Invalid e-mail or password");
        setIsLoading(false);
      })
      .finally(response => {});
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" size="large">
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
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
        <LoaderButton
          block
          type="submit"
          size="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </form>
    </div>
  );
}
