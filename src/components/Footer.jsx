// Footer.jsx
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import AddNewPatient from './AddNewPatient'; // Import the dialog component

const Footer = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div style={footerStyle}>
        <Tooltip title="Add patient record">
          <IconButton aria-label="add new record" style={iconButtonStyle} onClick={handleClickOpen}>
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Import new rows">
          <IconButton aria-label="import new rows" style={iconButtonStyle}>
            <FileUploadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Download grid">
          <IconButton aria-label="download grid" style={iconButtonStyle}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </div>

      <AddNewPatient open={open} onClose={handleClose} />
    </>
  );
};

// Inline style for the footer
const footerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
//   height: '60px',
  backgroundColor: 'rgb(247, 245, 242)',
  borderTop: '1px solid rgb(232, 231, 228)',
  padding: '0 20px',
  position: 'fixed',
  width: 'calc(100% - 40px)',
  maxWidth: '800px',
  bottom: '110px',
  left: '50%',
  transform: 'translateX(-50%)',
  boxSizing: 'border-box',
  zIndex: 1,
  margin: '0 auto',
  borderRadius: '10px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
};

const iconButtonStyle = {
  margin: '0 10px',
};

export default Footer;
