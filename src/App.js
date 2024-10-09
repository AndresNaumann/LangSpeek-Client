import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import logo from "./logo.svg";
import "./App.css";
import Navigation from "./components/Navigation";
import Landing from "./pages/landing";
import Chat from "./pages/Chat";
import About from "./pages/about";
import Admin from "./pages/admin";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import { auth } from "./firebase";

function App() {
  return (
    <div className="App">
      <>
        <Navigation />
        <Routes>
          <Route path="/landing" element={<Landing />} />{" "}
          <Route path="/chat" element={<Chat />} />{" "}
          <Route path="/about" element={<About />} />{" "}
          {/* <Route path="/admin" element={<Admin />} />{" "} */}
          <Route path="/login" element={<Login />} />{" "}
          <Route path="/signup" element={<SignUp />} />{" "}
          <Route path="/" element={<Landing />} />{" "}
          <Route
            path="/admin"
            element={<ProtectedRoute element={Admin} requiredRole="admin" />}
          />
        </Routes>
      </>
    </div>
  );
}

export default App;
