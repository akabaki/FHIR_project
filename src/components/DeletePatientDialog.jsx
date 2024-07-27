import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const DeletePatientDialog = ({ open, onClose, patientData, onDelete }) => {

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://demo.kodjin.com/fhir/Patient/${patientData.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Patient deleted successfully');
      onDelete(); // Call the onDelete callback to handle UI updates
    } catch (error) {
      console.error('Error deleting patient:', error);
    } finally {
      onClose(); // Close the dialog regardless of the result
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography variant="body1">Are you sure you want to delete this patient?</Typography>
        <Typography variant="subtitle2">Patient Details:</Typography>
        <Typography variant="body2">First Name: {patientData?.firstName}</Typography>
        <Typography variant="body2">Last Name: {patientData?.familyName}</Typography>
        <Typography variant="body2">Gender: {patientData?.gender}</Typography>
        <Typography variant="body2">Date of Birth: {patientData?.birthDate}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePatientDialog;
