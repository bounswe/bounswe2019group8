import React, { useState } from "react";
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
    api
      .post("auth_tokens", {
        email: fields.email,
        password: fields.password
      })
      .then(response => {
        //console.log(response);
        if (response.statusText === "OK") {
          //loginSuccess(response.data.user_id, response.data.token);
          localStorage.setItem("userId",response.data.user_id)
          localStorage.setItem("userToken",response.data.token)
          axios
          .get("http://8.209.81.242:8000/users/" + response.data.user_id, {
            headers: { Authorization: `Token ${response.data.token}` }
          })
          .then(res => {
            localStorage.setItem("userGroup", res.data.groups[0])
          });
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
