import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styled from "styled-components";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Footer from "./Footer";
import EditPatientDetails from './EditPatientDetails';
import DeletePatientDialog from './DeletePatientDialog';
import { createAvatar } from '@dicebear/core';
import { dylan } from '@dicebear/collection';
import "./styles.css";

const SearchBar = styled.input`
  margin-bottom: 20px;
  width: 800px;
  height: 50px;
  font-size: 22px;
  padding-left: 10px;
  border-radius: 5px;
  color: #fa26a0;
  z-index: 1;
`;
const Button = styled.button`
  background: orange;
  color: white;
  font-size: 15px;
  padding: 10px 30px;
  border: none;
  border-radius: 3px;
  font-weight: 500;
  margin: 20px;
  cursor: pointer;

  &:hover {
    background: darkorange;
  }

  &:disabled {
    background: grey;
    cursor: not-allowed;
    opacity: 0.6; /* Optional: Makes the button look visually 'disabled' */
  }
`;
// Styled component for the page input
const PageInput = styled.input`
  background: white;
  color: #333;
  font-size: 15px;
  padding: 10px;
  width: 50px;
  border: 1px solid #ccc;
  border-radius: 3px;
  text-align: center;
  margin: 0 10px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: orange;
  }
`;
const PageStatistics = styled.div`
text-align:center;
margin-top:-8px;
`
const GridNavigation = styled.div`
text-align:center;
margin-top:-19px;
`
export default function Grid() {
  const [quickFilter, setQuickFilter] = useState("");
  const [gridApi, setGridApi] = useState(null);
  const [patientData, setPatientData] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const pageSize = 10;

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  useEffect(() => {
    const url = `https://demo.kodjin.com/fhir/Patient?_sort=-_lastUpdated&_count=10&_skip=${(page-1)*10}&_total=accurate`;
    fetch(url, {
      headers: {
        'Prefer': 'pagination=offset-skip'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setTotalPatients(data.total)
        const patients = data.entry.map((entry) => {
          const resource = entry.resource;
          return {
            id: resource.id,
            firstName: resource.name[0]?.given?.join(" ") || "N/A",
            familyName: resource.name[0]?.family || "N/A",
            gender: resource.gender || "N/A",
            birthDate: resource.birthDate || "N/A",
            phoneNumber: resource.telecom?.find(t => t.system === 'phone')?.value || "N/A", // Extract phone number
          };
        });
        setPatientData(patients);
      })
      .catch((error) => console.error("Error fetching patient data:", error));
  }, [page]);


  useEffect(() => {
    if (gridApi) {
      gridApi.setQuickFilter(quickFilter);
    }
  }, [quickFilter, gridApi]);

  const handleQuickFilter = (e) => {
    setQuickFilter(e.target.value);
  };

  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleDeleteClick = (patient) => {
    setSelectedPatient(patient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleDeleteConfirm = () => {
    // Handle the delete logic here, e.g., call an API to delete the patient
    console.log("Deleting patient:", selectedPatient);

    // Remove the patient from the data list
    setPatientData(patientData.filter(patient => patient.id !== selectedPatient.id));
    setDeleteDialogOpen(false);
    setSelectedPatient(null);
  };

  const generateAvatar = (patient) => {
    return createAvatar(dylan, {
      seed: patient.id, // Use a unique value to generate the avatar
      size: 100,
      radius: 50, // Round the avatar image
    }).toDataUri();
  };

  const patientActionsRenderer = (p) => {
    return (
      <>
        <Tooltip title="Edit Patient" arrow>
          <IconButton sx={{ color: "white" }} onClick={() => handleEditClick(p.data)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Patient" arrow>
          <IconButton aria-label="delete" color="error" onClick={() => handleDeleteClick(p.data)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </>
    );
  };

  const avatarRenderer = (params) => {
    return (
      <img
        src={generateAvatar(params.data)}
        alt="Avatar"
        style={{ borderRadius: '50%', width: 50, height: 50 }}
      />
    );
  };

  const patient_list_columns = [
    {
      headerName: "Avatar",
      field: "avatar",
      width: 100,
      cellRenderer: avatarRenderer,
    },
    {
      headerName: "Patient ID",
      field: "id",
      sortable: true,
      resizable: true,
      width: 200,
      hide: true,
    },
    {
      headerName: "First Name",
      field: "firstName",
      sortable: true,
      resizable: true,
      width: 200,
    },
    {
      headerName: "Last Name",
      field: "familyName",
      sortable: true,
      resizable: false,
      width: 200,
    },
    {
      headerName: "Gender",
      field: "gender",
      sortable: true,
      resizable: true,
      wrapText: true,
      width: 150,
    },
    {
      headerName: "Date of Birth",
      field: "birthDate",
      sortable: true,
      resizable: true,
      wrapText: true,
      width: 150,
    },
    {
      headerName: "Phone Number",
      field: "phoneNumber",
      sortable: true,
      resizable: true,
      wrapText: true,
      width: 150,
    },
    {
      headerName: "Actions",
      field: "actions",
      resizable: true,
      width: 150,
      cellRenderer: patientActionsRenderer,
    },
  ];

  const totalPages = Math.ceil(totalPatients / pageSize);

  return (
    <>
      <SearchBar
        type="search"
        id="quickfilter"
        name="quickfilter"
        value={quickFilter}
        placeholder="Type here to search..."
        onChange={handleQuickFilter}
      />
      <div
        className="ag-theme-alpine"
        style={{ height: "500px", width: "1104px" }}
      >
        <AgGridReact
          rowData={patientData}
          columnDefs={patient_list_columns}
          pagination={true}
          suppressPaginationPanel={true}
          rowSelection="multiple"
          paginationPageSize={pageSize}
          paginationPageSizeSelector={false}
          onGridReady={onGridReady}
          quickFilterText={quickFilter}
          // onRowClicked={(event) => handleEditClick(event.data)} // Opens Edit dialog on row click
        />
        <GridNavigation className="gridNavigation">
          <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <PageInput
            type="number"
            value={page}
            onChange={(e) => {
              const newPage = Math.max(1, Math.min(totalPages, Number(e.target.value)));
              setPage(newPage);
            }}
            style={{ width: 50, textAlign: 'center', margin: '0 10px' }}
          />
          <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </GridNavigation>
        <PageStatistics className="pageStatistics">
          Page {page} of {totalPages} (Total Patients: {totalPatients})
        </PageStatistics>
      </div>
      <EditPatientDetails
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        patientData={selectedPatient}
      />
      <DeletePatientDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        patientData={selectedPatient}
        onDelete={handleDeleteConfirm}
      />
      <div>
        <Footer />
      </div>
    </>
  );
}
