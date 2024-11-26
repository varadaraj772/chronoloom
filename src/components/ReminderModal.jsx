import React from 'react';
import {StyleSheet} from 'react-native';
import {Modal, Portal, Button} from 'react-native-paper';
import ReminderForm from './ReminderForm';

const ReminderModal = ({visible, onDismiss, onSubmit, initialData}) => (
  <Portal>
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.modalContainer}>
      <ReminderForm onSubmit={onSubmit} initialData={initialData} />
      <Button onPress={onDismiss} style={styles.closeButton} textColor="red">
        Close
      </Button>
    </Modal>
  </Portal>
);

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 15,
  },
  closeButton: {
    marginTop: 8,
  },
});

export default ReminderModal;
