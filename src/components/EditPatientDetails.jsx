import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { createAvatar } from '@dicebear/core';
import { dylan } from '@dicebear/collection';

const EditPatientDetails = ({ open, onClose, patientData }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (patientData) {
      setFirstName(patientData.firstName || '');
      setLastName(patientData.familyName || '');
      setGender(patientData.gender || '');
      setDob(patientData.birthDate || '');
      setPhoneNumber(patientData.telecom?.find(t => t.system === 'phone')?.value || '');

      // Generate avatar for the patient
      const avatarUri = createAvatar(dylan, {
        seed: patientData.id, // Use patient ID or another unique identifier
        size: 150, // Size of the avatar
      }).toDataUri();

      setAvatar(avatarUri);
    }
  }, [patientData]);

  const handleSave = async () => {
    const selectedDate = new Date(dob);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
      setError('Date of birth cannot be in the future.');
      return;
    }

    if (!phoneNumber.trim()) {
      setError('Phone number cannot be empty.');
      return;
    }

    // Prepare updated patient data with resourceType included
    const updatedPatient = {
      resourceType: 'Patient', // Ensure resourceType is set
      id: patientData.id,
      name: [
        {
          family: lastName,
          given: [firstName],
          use: 'official'
        }
      ],
      gender: gender.toLowerCase(),
      birthDate: dob,
      telecom: [
        {
          system: 'phone',
          value: phoneNumber,
          use: 'work'
        }
      ],
      // Include other necessary fields as required by your FHIR server
    };

    try {
      const response = await fetch(`https://demo.kodjin.com/fhir/Patient/${patientData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/fhir+json',
        },
        body: JSON.stringify(updatedPatient),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Patient updated:', result);

      onClose();
      clearForm();
    } catch (err) {
      setError('Error updating patient: ' + err.message);
    }
  };

  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setGender('');
    setDob('');
    setPhoneNumber('');
    setAvatar('');
    setError('');
  };

  return (
    <Dialog open={open} onClose={onClose} onExited={clearForm}>
      <DialogTitle>Edit Patient Details</DialogTitle>
      <DialogContent>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src={avatar} alt="Patient Avatar" style={{ borderRadius: '50%' }} />
        </div>
        <TextField
          autoFocus
          margin="dense"
          label="First Name"
          type="text"
          fullWidth
          variant="outlined"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Last Name"
          type="text"
          fullWidth
          variant="outlined"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Gender"
          select
          fullWidth
          variant="outlined"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="unknown">Unknown</MenuItem>
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
          error={!!error}
          helperText={error}
        />
        <TextField
          margin="dense"
          label="Phone Number"
          type="tel"
          fullWidth
          variant="outlined"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          error={!!error}
          helperText={error}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPatientDetails;
