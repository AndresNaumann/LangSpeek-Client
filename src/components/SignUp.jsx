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
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); // Optional: Add loading state

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        course: "",
        email: user.email,
        instructor_id: "",
        name: "",
        role: "user", 
      });

      console.log("User data stored successfully");
      console.log("Navigating to /login");

      navigate("/login");
      setLoading(false); // Optional: End loading state
    } catch (error) {
      console.error("Error during sign-up:", error);
      setError("Failed to complete sign-up. Please try again.");
      setLoading(false); // Optional: End loading state
    }
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

            <Button variant="primary" type="submit" className="w-20">
              Sign Up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;
