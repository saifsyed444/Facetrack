import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const ViewStoredDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cameras, setCameras] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/cameras");
        const data = await response.json();
        setCameras(data);

      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    fetchCameras();
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this camera?");
      if (!confirmDelete) return;
  
      const response = await fetch(`http://localhost:5000/api/cameras/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        // Refresh from the server to ensure updated data
        const updatedResponse = await fetch("http://localhost:5000/api/cameras");
        const updatedData = await updatedResponse.json();
        setCameras(updatedData);
      } else {
        console.error("Failed to delete camera");
      }
    } catch (err) {
      console.error("Error deleting camera:", err);
    }
  };
  

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer open={sidebarOpen} onClose={toggleSidebar} sx={{ width: 240, flexShrink: 0 }}>
        <Toolbar />
        <Box sx={{ textAlign: "center", p: 2, fontFamily: "monospace", fontWeight: "bold", fontSize: "1.5rem" }}>
          FaceTrack
        </Box>
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem button component={Link} to="/dashboard">
              <ListItemText primary="Dashboard Overview" />
            </ListItem>
            <ListItem button component={Link} to="/add-cameras">
              <ListItemText primary="Add Cameras" />
            </ListItem>
            <ListItem button component={Link} to="/view-details">
              <ListItemText primary="View Stored Details" />
            </ListItem>
            <ListItem button component={Link} to="/authorized-members">
              <ListItemText primary="View Authorized Members" />
            </ListItem>
            <ListItem button component={Link} to="/add-authorized">
              <ListItemText primary="Add Authorized Members" />
            </ListItem>
            <ListItem button component={Link} to="/history">
              <ListItemText primary="History" />
            </ListItem>
            <ListItem button component={Link} to="/alerts">
              <ListItemText primary="Alerts" />
            </ListItem>
            <ListItem button component={Link} to="/live-monitor">
              <ListItemText primary="Live Camera Monitor" />
            </ListItem>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleSidebar}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" sx={{ flexGrow: 1, fontFamily: "monospace", fontWeight: "bold", letterSpacing: 2 }}>
              FaceTrack
            </Typography>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Stored Camera Details
          </Typography>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>IP Address</strong></TableCell>
                  <TableCell><strong>Location</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cameras.map((camera) => (
                  <TableRow key={camera._id}>
                    <TableCell>{camera.name}</TableCell>
                    <TableCell>{camera.ipAddress}</TableCell>
                    <TableCell>{camera.location || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(camera._id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Container>
      </Box>
    </div>
  );
};

export default ViewStoredDetails;
