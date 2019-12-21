import {Modal} from "react-bootstrap";
import { useFormFields } from "../../libs/hooksLib";
import React, { useState } from "react";
import {Button, Dropdown, ListGroupItem} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";
import "./addTreqModal.css";
import axios from "axios";

export default function AddTreqModal({...props}) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let [eq, setEq] = useState("");
    
    return (
      <div>
        <Button variant="primary" className="add-new-treq-btn" onClick={handleShow}>
          Read
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
                
                </Dropdown.Menu>
           </Dropdown>
             </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="add-new-treq-btn-close" onClick={handleClose}>
              Close
            </Button>
            <Button action href ="" variant="primary" className="add-new-treq-btn-add">
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
   
  }