import React, { useState } from "react";
import { Button, Card, ListGroup, Modal, ListGroupItem } from "react-bootstrap";

export default function Followers({ follows, ...props }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="outline-success" onClick={handleShow}>
        Followers
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Followers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {follows.map(follows1 => (
              <ListGroup.Item
                action
                variant="info"
                key={follows1.id}
                follows={follows1}
              >
                {follows1.userName}
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
