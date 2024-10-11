import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./firebase"; // Adjust the path as needed
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";

// import logo from "./logo.svg";
import "./App.css";
import Navigation from "./components/Navigation";
import Landing from "./pages/landing";
import Chat from "./pages/Chat";
import About from "./pages/about";
import Admin from "./pages/admin";
import Profile from "./pages/Profile";
import JoinClass from "./pages/JoinClass";
import Classroom from "./pages/Classroom";

// Components
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set persistence to local to maintain the session
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // Listen for auth state changes
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user); // User is signed in
          } else {
            setUser(null); // User is signed out
          }
        });
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });

    // Cleanup on unmount
    return () => {
      setUser(null);
    };
  }, [auth]);

 
  return (
    <div className="App">
      <>
        <Navigation />
        <Routes>
          <Route path="/landing" element={<Landing />} />{" "}
          <Route
            path="/chat"
            element={<ProtectedRoute element={Chat} requiredRoles={["admin", "student"]}/>}
          />{" "}
          <Route path="/about" element={<About />} />{" "}
          <Route path="/login" element={<Login />} />{" "}
          <Route path="/signup" element={<SignUp />} />{" "}
          <Route path="/profile" element={<Profile />} />{" "}
          <Route path="/joinclass" element={<JoinClass />} />{" "}
          <Route path="/classroom" element={<Classroom />} />{" "}
          <Route path="/" element={<Landing />} />{" "}
          <Route
            path="/admin"
            element={<ProtectedRoute element={Admin} requiredRoles={["admin"]} />}
          />
        </Routes>
      </>
    </div>
  );
}

export default App;
