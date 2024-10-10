import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { getAuth, signOut } from "firebase/auth"; // Import Firebase auth

// This is the Navigation component which is displayed at the top of every page in the website.
// Any edits made to the Navigation bar should be implemented here.

function Navigation() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  // Listen for changes in the user's authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Set the user state when authentication state changes
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [auth]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null); // Clear user state after logout
        navigate("/login"); // Redirect to login page after logout
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">
          IMRS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/chat">
              Chat
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              Contact
            </Nav.Link>
            <Nav.Link as={Link} to="/admin">
              Admin
            </Nav.Link>
          </Nav>

          <Nav className="ml-auto">
            {user ? (
              <>
                {/* If user is logged in, show the Logout button */}
                <Button variant="outline-danger" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* If user is not logged in, show Sign Up and Login buttons */}
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Button as={Link} to="/signup" variant="outline-primary">
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
