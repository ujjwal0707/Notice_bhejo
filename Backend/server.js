const express = require("express");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL connection

const db = mysql.createConnection({
  host: "127.0.0.1", // Use the IP address for localhost
  user: "root", // Your database username
  password: "root", // Your database password
  database: "payments_db", // The name of your database
  port: 3306, // Default MySQL port
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the MySQL database.");
  }
});

// Razorpay Configuration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_OpIFynystl53CS",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "AY6LScqdjpgQVIqUQYbDSUGb",
});

// API to create a Razorpay order and save it to the database
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save order details to the database
    const query = `INSERT INTO orders (order_id, amount, currency, receipt) VALUES (?, ?, ?, ?)`;
    db.query(
      query,
      [order.id, amount, "INR", options.receipt],
      (err, result) => {
        if (err) {
          console.error("Failed to save order in database:", err.message);
        } else {
          console.log("Order saved successfully in database");
        }
      }
    );

    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// API to handle form submissions and save to the database
app.post("/api/issues", (req, res) => {
  const { name, phone, email, senderAddress, receiverAddress, issue } = req.body;

  const query = `INSERT INTO issues (name, phone, email, sender_address, receiver_address, issue) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(
    query,
    [
      name,
      phone,
      email,
      senderAddress, // already stringified
      receiverAddress, // already stringified
      issue,
    ],
    (err, result) => {
      if (err) {
        console.error("Failed to save issue in database:", err.message);
        res.status(500).json({ error: "Failed to submit the issue" });
      } else {
        console.log("Issue submitted successfully");
        res.status(200).json({ message: "Issue submitted and saved successfully" });
      }
    }
  );
});


app.get('/api/issues', (req, res) => {
  const query = 'SELECT * FROM issues';
  
  db.query(query, (err, result) => {
    if (err) {
      console.error('Failed to fetch data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    // Use `result` here instead of `rows`
    const issues = result.map((row) => ({
      ...row,
      sender_address: row.sender_address || '{}',
      receiver_address: row.receiver_address || '{}',
    }));

    console.log('Transformed issues:', issues);

    // Send the transformed issues as the response
    res.json(issues);
    
    // Log the raw result for debugging
    console.log('Raw database result:', result);
  });
});




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
