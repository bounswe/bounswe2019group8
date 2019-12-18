import React, { useState } from "react";
import {
  FormGroup,
  FormControl,
  FormLabel,
  Button,
  FormText,
  Badge
} from "react-bootstrap";
import { useFormFields } from "../../libs/hooksLib";

import axios from "axios";
import { withRouter } from "react-router-dom";
import LoaderButton from "../../containers/LoaderButton";

export default function CreatePortfolio(submitClicked, ...props) {
  const [isLoading, setIsLoading] = useState(false);
  const [switchOn, switchClicked] = useState(true);
  const [fields, handleFieldChange] = useFormFields({
    name: ""
  });

  function validateForm() {
    return fields.name.length > 0;
  }
  function switchChange(){
      switchClicked(!switchOn);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);
    var token = localStorage.getItem("userToken");
    var switchVar = "False";
    if(switchOn !== true){
        switchVar = "True";
    }
    else{
        switchVar = "False";
    }
    var data = {
      name: fields.name,
      private: switchVar,
      tr_eqs: []
    };
    var user_id = localStorage.getItem("userId");
    var token = localStorage.getItem("userToken");
    axios
      .post("http://8.209.81.242:8000/users/"+user_id+"/portfolios", data, {
        headers: { Authorization: `Token ${token}` }
      })
      .then(function (response) {
        //window.location.reload();
      });

  }
  return (
    <div className="field-container">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="name" size="large">
          <FormLabel>
            <Badge>Portfolio Name</Badge>
          </FormLabel>
          <FormControl
            autoFocus
            type="name"
            value={fields.name}
            onChange={handleFieldChange}
          />
          <FormText className="text-muted">
            This fields can be updated any time.
            </FormText>
        </FormGroup>

        <div className='custom-control custom-switch'>
        <input
          onChange={switchChange}
          type='checkbox'
          className='custom-control-input'
          id='customSwitches'
          readOnly
        />
        <label className='custom-control-label' htmlFor='customSwitches'>
          Set Private.
        </label>
      </div>

        <LoaderButton
          block
          style={{ marginTop: 30, width: 200}}
          type="submit"
          size="sm"
          variant='outline-primary'
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create Portfolio
          </LoaderButton>
      </form>
    </div>
  );
}
