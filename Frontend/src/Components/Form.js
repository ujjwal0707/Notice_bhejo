import React, { useState } from "react";
import {
  TextField,
  Box,
  Button,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  Container,
} from "@mui/material";
import axios from "axios";
import logo from "./assets/logo.png";
import bgr from "./assets/bgr.png";

const Form = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true); // Script already loaded
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle payment and form submission
  const handlePayment = async (formData) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK. Please check your connection.");
      return;
    }

    try {
      // Request backend to create an order
      const { data: orderData } = await axios.post("http://localhost:5000/api/create-order", {
        amount: 50000, // Amount in paise (₹500)
      });

      console.log("Order Data:", orderData);

      const options = {
        key: "rzp_test_OpIFynystl53CS", // Replace with your Razorpay test key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Notice Bhejo",
        description: "Payment for Issue Submission",
        order_id: orderData.id,
        handler: async (response) => {
          console.log("Payment Successful:", response);

          // Submit the form data to backend after payment success
          try {
  const response = await axios.post('http://localhost:5000/api/issues', formData);
  console.log('Form submitted successfully:', response.data);
} catch (error) {
  console.error('Error submitting form:', error);
  alert('Error submitting the form. Please try again.');
}
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during payment initiation:", error);
      alert("Error in initiating payment. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
  name: e.target.name.value,
  phone: e.target.phone.value,
  email: e.target.email.value,
  senderAddress: JSON.stringify({
    address: e.target.senderAddress.value,
    city: e.target.senderCity.value,
    pincode: e.target.senderPincode.value,
    district: e.target.senderDistrict.value,
    state: e.target.senderState.value,
    country: e.target.senderCountry.value,
  }),
  receiverAddress: JSON.stringify({
    address: e.target.receiverAddress.value,
    city: e.target.receiverCity.value,
    pincode: e.target.receiverPincode.value,
    district: e.target.receiverDistrict.value,
    state: e.target.receiverState.value,
    country: e.target.receiverCountry.value,
  }),
  issue: e.target.issue.value,
};


    try {
      await handlePayment(formData);
    } catch (error) {
      console.error("Error during submission:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // background: `url(${bgr})`,
        backgroundColor:'grey',
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        color: "black",
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: "black", minHeight: "10px" }}>
        <Toolbar sx={{ display: "flex", alignItems: "center", minHeight: "100px" }}>
          <img src={logo} alt="Logo" style={{ width: "98px", height: "70px", marginRight: "-10px" }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Merriweather",
              flexGrow: 1,
              color: "yellow",
              fontSize: "14px",
            }}
          >
            NOTICE BHEJO
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Box
          sx={{
            maxWidth: 650,
            margin: "0 auto",
            padding: 4,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }}
        >
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
            Issue Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Personal Details */}
              <Grid item xs={12}>
                <TextField fullWidth required label="Name" variant="outlined" name="name" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth required label="Phone Number" variant="outlined" name="phone" type="tel" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth required label="Email ID" variant="outlined" name="email" type="email" />
              </Grid>

              {/* Sender Address */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Sender's Address
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth required label="Address" variant="outlined" name="senderAddress" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth required label="City" variant="outlined" name="senderCity" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth required label="Pincode" variant="outlined" name="senderPincode" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth required label="District" variant="outlined" name="senderDistrict" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth required label="State" variant="outlined" name="senderState" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth required label="Country" variant="outlined" name="senderCountry" />
              </Grid>

              {/* Receiver Address */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Receiver's Address
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth required label="Address" variant="outlined" name="receiverAddress" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth required label="City" variant="outlined" name="receiverCity" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth required label="Pincode" variant="outlined" name="receiverPincode" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth required label="District" variant="outlined" name="receiverDistrict" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth required label="State" variant="outlined" name="receiverState" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth required label="Country" variant="outlined" name="receiverCountry" />
              </Grid>

              {/* Issue */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Issue"
                  variant="outlined"
                  name="issue"
                  multiline
                  rows={4}
                />
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isLoading}
                  sx={{ backgroundColor: "black", color: "yellow" }}
                >
                  {isLoading ? "Submitting..." : "Submit & Pay"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Form;
