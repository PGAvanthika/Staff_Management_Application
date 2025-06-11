import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
} from '@mui/material';
import DueExtensionForm from '../../client/src/Components/DueExtensionForm';

const ManagerDueExtensions = () => {
  const [dueExtensions, setDueExtensions] = useState([]);
  const [selectedDue, setSelectedDue] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDueExtensions();
  }, []);

  const fetchDueExtensions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/dues/manager/dues', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setDueExtensions(data);
    } catch (err) {
      setError('Failed to fetch due extensions');
      console.error(err);
    }
  };

  const handleDueClick = (due) => {
    setSelectedDue(due);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedDue(null);
  };

  const handleAction = () => {
    fetchDueExtensions();
    handleCloseForm();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Due Extension Requests
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {dueExtensions.map((due) => (
          <Grid item xs={12} md={6} lg={4} key={due.due_id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => handleDueClick(due)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Task: {due.task_id}
                </Typography>
                <Typography color="textSecondary">
                  Employee: {due.emp_id}
                </Typography>
                <Typography color="textSecondary">
                  Requested Days: {due.no_of_days}
                </Typography>
                <Typography color="textSecondary">
                  Status: {due.status || 'Pending'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {showForm && selectedDue && (
        <DueExtensionForm
          due={selectedDue}
          onClose={handleCloseForm}
          onAction={handleAction}
        />
      )}
    </Box>
  );
};

export default ManagerDueExtensions; 