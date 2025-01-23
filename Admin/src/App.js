import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FeedbackTable from "./FeedbackTable"; // Import the FeedbackForm component
import Login from "./LoginPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Form route */}
        <Route path="/FeedbackTable" element={<FeedbackTable />} /> {/* Form route */}
       
      </Routes>
    </Router>
  );
}

export default App;
