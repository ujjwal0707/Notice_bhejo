import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

import bgImage from "./assets/bg.jpg"; // Background image

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    username: "", // Changed from email to username for consistency
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = () => {
    console.log("Form Data:", formData);
    if (formData.username === "admin" && formData.password === "Admin@2024#") {
      setError(false);
      navigate("/FeedbackTable");
    } else {
      setError(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Background overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      ></Box>

      <Box
        sx={{
          maxWidth: { xs: "90%", sm: 400 },
          width: "100%",
          zIndex: 2,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          padding: 4,
        }}
      >
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ color: "black", fontWeight: "bold" }}
          >
            Login
          </Typography>
          {error && (
            <Alert
              severity="error"
              sx={{ marginBottom: 2 }}
              onClose={() => setError(false)}
            >
              Invalid Login Credentials!
            </Alert>
          )}
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: "10px",
              fontWeight: "bold",
              ":hover": {
                backgroundColor: "black",
                color: "#fff",
              },
            }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
