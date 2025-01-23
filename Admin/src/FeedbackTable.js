import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Paper, Typography } from '@mui/material';
import axios from 'axios';
// import bgImage from './assets/bg.jpg';
import ResponsiveAppBar from "./components/AccountMenu.js";

// Define columns for displaying form data
const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'phone', headerName: 'Phone', width: 150 },
  { field: 'email', headerName: 'Email', width: 250 },
  {
  field: 'sender_address',
  headerName: "Sender's Address",
  width: 400,
    valueGetter: (params) => {
      console.log('sdfasd', params);
    try {
      if (!params.address) {
        console.warn('Missing sender address for row:', params);
        return 'Sender address not available';
      }
      const senderAddress = params;
      return `${senderAddress.address}, ${senderAddress.city}, ${senderAddress.state}, ${senderAddress.country}, ${senderAddress.pincode}`;
    } catch (error) {
      console.error('Error parsing sender address:', error);
      return 'Invalid sender address';
    }
  },
},
{
  field: 'receiver_address',
  headerName: "Receiver's Address",
  width: 400,
  valueGetter: (params) => {
    try {
      if (!params.address) {
        console.warn('Missing receiver address for row:', params);
        return 'Receiver address not available';
      }

      return `${params.address}, ${params.city}, ${params.state}, ${params.country}, ${params.pincode}`;
    } catch (error) {
      console.error('Error parsing receiver address:', error);
      return 'Invalid receiver address';
    }
  },
}
,
  { field: 'issue', headerName: 'Issue', width: 300 },
];



const FeedbackTable = () => {
  const [rows, setRows] = useState([]);

  // Fetch form data from the backend when the component mounts
const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/issues');
    let rows = response.data;

    // Apply the transformation to ensure sender_address and receiver_address are never undefined
    const issues = rows.map((row) => ({
      ...row,
      sender_address: row.sender_address || '{}',
      receiver_address: row.receiver_address || '{}',
    }));

    console.log('Transformed issues:', issues);
    setRows(issues); // Update the state with the transformed data
  } catch (error) {
    console.error('Error fetching form data:', error);
  }
};



  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <ResponsiveAppBar />
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          // backgroundImage: `url(${bgImage})`,
          backgroundColor:'grey',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '94vh',
          padding: '20px'
        }}
      >
        <Typography
          variant="h4"
          component="h3"
          sx={{
            marginLeft: '70px',
            marginBottom: '20px',
            fontWeight: 'bold',
            fontFamily: 'roboto',
            color: 'dark'
          }}
        >
          Submitted Issues
        </Typography>
        <Paper elevation={3} sx={{ width: '90%', marginLeft: '60px', marginTop: '10px' }}>
          <div style={{ height: '80vh' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              sx={{
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: 'black',
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: 'roboto'
                },
              }}
            />
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default FeedbackTable;
