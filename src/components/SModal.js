import React, { useState, useEffect } from 'react';
import { Modal, Header, Button } from 'semantic-ui-react';

// const options = [
//   { key: 'zero', text: '0', value: 0 },
//   { key: 'one', text: '1', value: 1 },
//   { key: 'two', text: '2', value: 2 },
//   { key: 'three', text: '3', value: 3 },
//   { key: 'four', text: '4', value: 4 },
//   { key: 'five', text: '5', value: 5 },
//   { key: 'six', text: '6', value: 6 },
//   { key: 'seven', text: '7', value: 7 },
//   { key: 'eight', text: '8', value: 8 },
//   { key: 'nine', text: '9', value: 9 }
// ]

function SModal(props) {
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    setModalOpen(props.modalOpen);
  }, [props.modalOpen]);

  return (
    <Modal
      open={modalOpen}
      onClose={props.onHide}
      size='mini'
      closeIcon
      className="SModal"
      >
      <Header as='h4'>Message</Header>
      <Modal.Content>
        <p>La valeur sélectionée ne peut être placé à cette position </p>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red'>Close</Button>
      </Modal.Actions>
    </Modal>
  )
}

export default SModal;