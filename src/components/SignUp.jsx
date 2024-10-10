import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../firebase"; // Import Firestore instance
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Try storing user info and role in Firestore
        try {
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            role: "user", // Set default role as 'user'
          });
          console.log("User role stored successfully");
        } catch (firestoreError) {
          console.error(
            "Error storing user role in Firestore:",
            firestoreError
          );
          setError("Failed to store user data. Please try again.");
        }

        // Redirect to login even if Firestore fails (but log error)
        navigate("/login");
      })
      .catch((error) => {
        setError(error.message); // Handle auth errors
        console.error("Error signing up:", error);
      });
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6} className="mt-5">
          <h2 className="text-center">Sign Up</h2>
          {error && <p className="text-danger">{error}</p>}
          <Form onSubmit={handleSignUp}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Sign Up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;
