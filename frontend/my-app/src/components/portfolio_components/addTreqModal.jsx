import {Modal} from "react-bootstrap";
import { useFormFields } from "../../libs/hooksLib";
import React, { useState } from "react";
import {Button, Dropdown, ListGroupItem} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";
import "./addTreqModal.css";
import axios from "axios";
import DropDownHandler from "./dropDownHandler";
import {MdLibraryAdd} from 'react-icons/md'

export default function AddTreqModal({...props}) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let [eq, setEq] = useState("");
    const handleSet = (x) => {
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
        var data = {
            tr_eqs: [{"sym":eq}].concat(JSON.parse(stringToSend))
        }
        axios
        .put("http://8.209.81.242:8000/users/" + userId + "/portfolios/" + props.pk, data,{
        headers: { Authorization: `Token ${token}` }
        }).then(response => {
        });
        handleClose();
        handleReRender();
    }
   
    var eqNames = [];
    var eqList = JSON.parse(localStorage.getItem("equipmentList"));
    for(var i = 0; i < eqList.length; i++){

    //eqNames.push(<DropdownItem onClick={() => setEq(eqList[i])} className="dropdown-item">{eqList[i].name}</DropdownItem>);
    eqNames.push(<DropDownHandler eq={eqList[i]} onDropDownHandler={handleSet} ></DropDownHandler>);
    }
    return (
      <div >
        <Button style={{maxWidth:300, fontWeight:'lighter', letterSpacing:3}} variant="primary" className="add-new-treq-btn" onClick={handleShow}>
          <MdLibraryAdd></MdLibraryAdd> NEW EQUIPMENT
        </Button>
  
        <Modal  show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title style={{fontSize:20}}>Add a new trading equipment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Dropdown >
                <Dropdown.Toggle style={{marginBottom:30}} variant="success" id="dropdown-basic">
                    Equipments
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-for-modal">
                   {eqNames}
                </Dropdown.Menu>
                <div style={{textAlign:'center', fontSize:32}}>
                  {eq}
                </div>
           </Dropdown>
             </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="add-new-treq-btn-close" onClick={handleClose}>
              Close
            </Button>
            <Button action href ={"/profile/" + localStorage.getItem("userId") +"/portfolio/" + props.pk} variant="primary" className="add-new-treq-btn-add"onClick={handleAdd}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
   
  }
