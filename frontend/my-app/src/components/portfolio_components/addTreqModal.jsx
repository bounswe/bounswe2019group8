import {Modal} from "react-bootstrap";
import { useFormFields } from "../../libs/hooksLib";
import React, { useState } from "react";
import {Button, Dropdown, ListGroupItem} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";
import "./addTreqModal.css";
import axios from "axios";
import DropDownHandler from "./dropDownHandler";

export default function AddTreqModal({...props}) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let [eq, setEq] = useState("");
    const handleSet = (x) => {
        console.log("x:" + x);
        setEq(x);
    }
    const handleReRender = () => {
        props.onAddTreqModal();            
    }
    const handleAdd = () => {
        var userId = localStorage.getItem("userId");
        var token = localStorage.getItem("userToken");
        var prevEqs = props.prevEqs;
        var stringToSend = "[";
        for(var i = 0; i < prevEqs.length; i++){
            if(i == prevEqs.length-1){
                stringToSend += "{\"sym\":\"" + prevEqs[i].sym + "\"}";
            }
            else{
                stringToSend += "{\"sym\":\"" + prevEqs[i].sym + "\"},";
            }
        }
        stringToSend += "]";
        console.log(stringToSend);
        console.log(JSON.parse(stringToSend));
        var data = {
            tr_eqs: [{"sym":eq}].concat(JSON.parse(stringToSend))
        }
        console.log(data.tr_eqs);
        axios
        .put("http://8.209.81.242:8000/users/" + userId + "/portfolios/" + props.pk, data,{
        headers: { Authorization: `Token ${token}` }
        }).then(response => {
            console.log(response);
        });
        handleClose();
        handleReRender();
    }
   
    var eqNames = [];
    var eqList = JSON.parse(localStorage.getItem("equipmentList"));
    for(var i = 0; i < eqList.length; i++){
    console.log(eqList.length);
    //eqNames.push(<DropdownItem onClick={() => setEq(eqList[i])} className="dropdown-item">{eqList[i].name}</DropdownItem>);
    eqNames.push(<DropDownHandler eq={eqList[i]} onDropDownHandler={handleSet} ></DropDownHandler>);
    }
    return (
      <div>
        <Button variant="primary" className="add-new-treq-btn" onClick={handleShow}>
          Add a new trading equipment to this portfolio!
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a new trading equipment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Dropdown >
                <Dropdown.Toggle className="drop-dpwn-toggle-btn" variant="success" id="dropdown-basic">
                    Equipments
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-for-modal">
                   {eqNames}
                </Dropdown.Menu>
           </Dropdown>
             </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="add-new-treq-btn-close" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" className="add-new-treq-btn-add"onClick={handleAdd}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
   
  }