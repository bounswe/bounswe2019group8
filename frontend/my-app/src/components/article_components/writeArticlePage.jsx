import React from "react";
import { Form, Button } from "react-bootstrap";
import "./writeArticlePage.css";
import { useFormFields } from "../../libs/hooksLib";
import axios from "axios";

export default function WriteArticle() {
  const [fields, handleFieldChange] = useFormFields({
    title: "",
    content: ""
  });

  const xhandleSubmit = event => {
    var token = localStorage.getItem("userToken");
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      console.log("girdim");
      axios
        .post("http://8.209.81.242:8000/articles", {
          headers: { Authorization: `Token ${token}` },
          title: "First Article Trial",
          content:
            "This article was created in order to be able to make trials."
        })
        .then(function(response) {
          console.log(response);
        });
    }
  };
  function handleSubmit() {
    var token = localStorage.getItem("userToken");
    console.log(token);
    axios
      .post("http://8.209.81.242:8000/articles", {
        headers: { Authorization: `Token ${token}` },
        body: {
          title: "First Article Trial",
          content:
            "This article was created in order to be able to make trials."
        }
      })
      .then(function(response) {
        console.log(response);
      });
  }

  function renderForm() {
    return (
      <div className="field-container">
        <Form>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Title:</Form.Label>
            <Form.Control
              /*value={fields.title}*/ onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Content:</Form.Label>
            <Form.Control
              //value={fields.content}
              onChange={handleFieldChange}
              as="textarea"
              rows="3"
            />
          </Form.Group>
        </Form>
        <Button block type="submit" size="large" onClick={handleSubmit}>
          Submit Article
        </Button>
      </div>
    );
  }
  return <div className="WriteArticle">{renderForm()}</div>;
}
