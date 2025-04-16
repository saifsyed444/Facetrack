import React, { useRef, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useUsername } from "../context/UsernameContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const LiveMonitor = () => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [frameCount, setFrameCount] = useState(1);
  const [intervalId, setIntervalId] = useState(null);
  const { username } = useUsername();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setIsStreaming(true);
  };

  useEffect(() => {
    if (isStreaming) {
      const id = setInterval(() => {
        captureAndSend();
      }, 1000);
      setIntervalId(id);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isStreaming]);

  const captureAndSend = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("user_id", username);
      formData.append("file", blob, "frame.jpg");

      try {
        const res = await axios.post("https://0239-35-204-227-158.ngrok-free.app/test-frame", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(`sent frame ${frameCount}`);
        setFrameCount(prev => prev + 1);

        const timestamp = new Date().toLocaleString();
        res.data.results.forEach((result) => {
          console.log(`[${timestamp}] name: ${result.name}`);
        });

      } catch (error) {
        console.error("Error sending frame:", error);
      }
    }, "image/jpeg");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", minHeight: "100vh", background: "linear-gradient(to right, rgba(15,23,42,0.9), rgba(30,58,138,0.85))" }}>
      {/* Sidebar */}
      <Drawer open={sidebarOpen} onClose={toggleSidebar} sx={{ width: 240, flexShrink: 0 }}>
        <Toolbar />
        <Box sx={{ textAlign: "center", p: 2, fontFamily: "monospace", fontWeight: "bold", fontSize: "1.5rem" }}>
          FaceTrack
        </Box>
        <Box sx={{ overflow: "auto" }}>
          <List>
            {[["Dashboard Overview", "/dashboard"],
              ["Add Camera Details", "/add-cameras"],
              ["View Stored Details", "/view-details"],
              ["Add Authorized Members", "/add-authorized"],
              ["View Authorized Members", "/authorized-members"],
              ["History", "/history"],
              ["Alerts", "/alerts"],
              ["Live Camera Monitor", "/live-monitor"],
              ["Logout", "/login"]
            ].map(([text, path]) => (
              <ListItem button component={Link} to={path} key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="static" sx={{ backgroundColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={toggleSidebar} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: "bold",
                letterSpacing: 2,
                color: "#fff",
              }}
            >
              FaceTrack
            </Typography>
          </Toolbar>
        </AppBar>

        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            maxWidth: "800px",
            width: "100%",
            textAlign: "center",
            margin: "auto",
            marginTop: "2rem"
          }}
        >
          <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#fff" }}>
            🎥 Live Camera Monitor
          </h2>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              borderRadius: "12px",
              border: "2px solid #334155",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              width: "100%",
              maxWidth: "640px",
              height: "auto",
            }}
          />
          <br />
          <button
            onClick={startCamera}
            style={{
              marginTop: "1.5rem",
              padding: "1rem 2rem",
              fontSize: "1.1rem",
              fontWeight: "bold",
              backgroundColor: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(22,163,74,0.4)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={e => e.target.style.backgroundColor = "#15803d"}
            onMouseLeave={e => e.target.style.backgroundColor = "#16a34a"}
          >
            Start Camera & Stream Frames
          </button>
        </div>
      </Box>
    </Box>
  );
};

export default LiveMonitor;
