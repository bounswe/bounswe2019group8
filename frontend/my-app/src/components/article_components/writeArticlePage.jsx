import React, { useState } from "react";
import {
  FormGroup,
  FormControl,
  FormLabel,
  Button,
  Badge
} from "react-bootstrap";
import { useFormFields } from "../../libs/hooksLib";
import "../../containers/Login.css";
import "./writeArticlePage.css";
import axios from "axios";
import { withRouter } from "react-router-dom";
import LoaderButton from "../../containers/LoaderButton";

export default function WriteArticlePage(submitClicked, ...props) {
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    title: "",
    content: ""
  });

  function validateForm() {
    return fields.title.length > 0 && fields.content.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);
    var token = localStorage.getItem("userToken");
    console.log(token);
    var data = {
      title: fields.title,
      content: fields.content
    };
    axios
      .post("http://8.209.81.242:8000/articles", data, {
        headers: { Authorization: `Token ${token}` }
      })
      .then(function (response) {
        console.log(response);
        window.location.reload();
      });

  }
  return (
    <div className="field-container">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="title" size="large">
          <FormLabel>
            <Badge>Title:</Badge>
          </FormLabel>
          <FormControl
            autoFocus
            type="title"
            value={fields.title}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="content" size="large">
          <FormLabel>
            <Badge>Content:</Badge>
          </FormLabel>
          <FormControl
            type="content"
            value={fields.content}
            onChange={handleFieldChange}
            as="textarea"
            rows="12"
          />
        </FormGroup>

        <LoaderButton
          block
          style={{ marginTop: 30, width: 200}}
          type="submit"
          size="sm"
          variant='outline-primary'
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Send Article
          </LoaderButton>
      </form>
    </div>
  );
}
