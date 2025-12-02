import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import TaskIcon from '@mui/icons-material/Task';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ManagerDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manager Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Projects</Typography>
              </Box>
              <Button
                component={Link}
                to="/manager/projects"
                variant="contained"
                fullWidth
              >
                View Projects
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Team Members</Typography>
              </Box>
              <Button
                component={Link}
                to="/manager/team"
                variant="contained"
                fullWidth
              >
                View Team
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TaskIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Tasks</Typography>
              </Box>
              <Button
                component={Link}
                to="/manager/tasks"
                variant="contained"
                fullWidth
              >
                View Tasks
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Due Extensions</Typography>
              </Box>
              <Button
                component={Link}
                to="/manager/dues"
                variant="contained"
                fullWidth
              >
                View Due Extensions
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboard;

