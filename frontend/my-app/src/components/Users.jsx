import React, { useState } from "react";
import { Button, ListGroup, Modal } from "react-bootstrap";

export default function Users({ users, ...props }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="outline-success" onClick={handleShow}>
        Users
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {users.map(users1 => (
              <ListGroup.Item
                action
                variant="info"
                key={users1.id}
                users={users1}
              >
                {users1.userName}
                <button>Follow</button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
