import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

const AddPatientDialog = ({ open, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleAddPatient = async () => {
    // Validate form fields
    if (!firstName || !lastName || !gender || !dob || !phoneNumber) {
      setError('All fields are required.');
      return;
    }

    const selectedDate = new Date(dob);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
      setError('Date of birth cannot be in the future.');
      return;
    }

    // Prepare FHIR patient resource
    const newPatient = {
      resourceType: 'Patient',
      active: true,
      name: [
        {
          family: lastName,
          given: [firstName],
          text: `${firstName} ${lastName}`,
          use: 'official'
        }
      ],
      gender: gender.toLowerCase(),
      birthDate: dob,
      telecom: [
        {
          system: 'phone',
          use: 'work',
          value: phoneNumber
        }
      ],
      // Additional fields as needed
    };

    try {
      const response = await fetch('https://demo.kodjin.com/fhir/Patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/fhir+json',
        },
        body: JSON.stringify(newPatient),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Patient added:', result);

      onClose();
      clearForm();
    } catch (err) {
      setError('Error adding patient: ' + err.message);
    }
  };

  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setGender('');
    setDob('');
    setPhoneNumber('');
    setError('');
  };

  return (
    <Dialog open={open} onClose={onClose} onExited={clearForm}>
      <DialogTitle>Add New Patient</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="First Name"
          type="text"
          fullWidth
          variant="outlined"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={!!error && !firstName}
          helperText={!!error && !firstName ? 'First name is required' : ''}
        />
        <TextField
          margin="dense"
          label="Last Name"
          type="text"
          fullWidth
          variant="outlined"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={!!error && !lastName}
          helperText={!!error && !lastName ? 'Last name is required' : ''}
        />
        <TextField
          margin="dense"
          label="Gender"
          select
          fullWidth
          variant="outlined"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          error={!!error && !gender}
          helperText={!!error && !gender ? 'Gender is required' : ''}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Unknown">Unknown</MenuItem>
        </TextField>
        <TextField
          margin="dense"
          label="Date of Birth"
          type="date"
          fullWidth
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          error={!!error && (!dob || new Date(dob) > new Date())}
          helperText={error || (!dob ? 'Date of birth is required' : '')}
        />
        <TextField
          margin="dense"
          label="Phone Number"
          type="tel"
          fullWidth
          variant="outlined"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          error={!!error && !phoneNumber}
          helperText={!!error && !phoneNumber ? 'Phone number is required' : ''}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddPatient} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPatientDialog;
