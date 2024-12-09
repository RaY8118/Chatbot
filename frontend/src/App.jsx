import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Chatbot from "./components/Chatbot";
const App = () => {
  return (
    <Router>
      <ToastContainer autoClose={2500} />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  );
};

export default App;
