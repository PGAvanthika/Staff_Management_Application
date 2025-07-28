import React, { useState, useEffect } from "react";
import DueExtensionForm from "./DueExtensionForm";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  Chip,
  Stack,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const statusColor = (status) => {
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "error";
    default:
      return "warning";
  }
};

function getCurrentYearMonth() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

const ManagerDueExtensions = ({
  onlyShowForm = false,
  buttonConfig = {},
  selectedDue: externalDue,
  onCloseForm, // <- this is key for closing in form-only mode
}) => {
  const [dueExtensions, setDueExtensions] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedDue, setSelectedDue] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [tab, setTab] = useState(0);

  const fallbackDue = {
    due_id: "DUE001",
    emp_id: "EMP123",
    tl_id: "TL456",
    project_id: "PRJ789",
    task_id: "TSK101",
    no_of_days: 3,
    reason: "Need more time for testing and review",
    current_deadline: new Date().toISOString(),
  };

  useEffect(() => {
    if (!onlyShowForm) {
      fetchDueExtensions();
      fetchHistory();
    }
  }, [onlyShowForm]);

  const fetchDueExtensions = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/dues/manager/dues",
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setDueExtensions(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch due extensions");
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const { year, month } = getCurrentYearMonth();
      const response = await fetch(
        `http://localhost:3001/api/dues/manager/history?year=${year}&month=${month}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Failed to fetch history");
      const data = await response.json();
      setHistory(data);
      setHistoryError("");
    } catch (err) {
      setHistoryError("Failed to fetch due extension history");
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
    fetchHistory();
    handleCloseForm();
    onCloseForm?.(); // also trigger parent close if in form-only
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError("");
    setHistoryError("");
  };

  // ✅ Show only form view
  if (onlyShowForm) {
    return (
      <Box sx={{ p: 4 }}>
        {externalDue ? (
          <DueExtensionForm
            due={externalDue}
            onClose={onCloseForm || (() => console.log("Form closed"))}
            onAction={handleAction}
            readOnly={true}
            {...buttonConfig}
          />
        ) : (
          <Typography variant="body1">No Due Data Found</Typography>
        )}
      </Box>
    );
  }

  // ✅ Full view: requests + history + popup form
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
        Due Extensions
      </Typography>

      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Requests" />
        <Tab label="History" />
      </Tabs>

      {error && tab === 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {historyError && tab === 1 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {historyError}
        </Alert>
      )}

      {tab === 0 && (
        <Grid container spacing={3}>
          {dueExtensions.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ m: 2 }}>
                No due extension requests found.
              </Typography>
            </Grid>
          ) : (
            dueExtensions.map((due) => (
              <Grid item xs={12} md={6} lg={4} key={due.due_id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "0.2s",
                    "&:hover": { boxShadow: 6, bgcolor: "#f0f6ff" },
                    minHeight: 200,
                  }}
                  onClick={() => handleDueClick(due)}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        color="primary.dark"
                      >
                        Task: {due.task_id}
                      </Typography>
                      <Chip
                        label={
                          due.status
                            ? due.status.charAt(0).toUpperCase() +
                              due.status.slice(1)
                            : "Pending"
                        }
                        color={statusColor(due.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Stack>
                    <Typography fontSize={15}>
                      <strong>Employee:</strong> {due.emp_id}
                    </Typography>
                    <Typography fontSize={15}>
                      <strong>Project:</strong> {due.project_id}
                    </Typography>
                    <Typography fontSize={15}>
                      <strong>Team Lead:</strong> {due.tl_id}
                    </Typography>
                    <Typography fontSize={15}>
                      <strong>Requested Days:</strong> {due.no_of_days}
                    </Typography>
                    <Typography fontSize={15}>
                      <strong>Reason:</strong> {due.reason}
                    </Typography>
                    <Typography fontSize={15}>
                      <strong>Deadline:</strong>{" "}
                      {due.current_deadline && !isNaN(new Date(due.current_deadline))
                        ? new Date(due.current_deadline).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {tab === 1 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task ID</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Team Lead</TableCell>
                <TableCell>Requested Days</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Current Deadline</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Action Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No history for this month.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((due) => (
                  <TableRow key={due.due_id}>
                    <TableCell>{due.task_id}</TableCell>
                    <TableCell>{due.emp_id}</TableCell>
                    <TableCell>{due.project_id}</TableCell>
                    <TableCell>{due.tl_id}</TableCell>
                    <TableCell>{due.no_of_days}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          due.status
                            ? due.status.charAt(0).toUpperCase() +
                              due.status.slice(1)
                            : "Pending"
                        }
                        color={statusColor(due.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      {due.current_deadline && !isNaN(new Date(due.current_deadline))
                        ? new Date(due.current_deadline).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>{due.reason}</TableCell>
                    <TableCell>
                      {due.created_at
                        ? new Date(due.created_at).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {showForm && selectedDue && (
        <DueExtensionForm
          due={selectedDue}
          onClose={handleCloseForm}
          onAction={handleAction}
          readOnly={true}
          {...buttonConfig}
        />
      )}
    </Box>
  );
};

export default ManagerDueExtensions;
