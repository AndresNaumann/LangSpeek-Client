import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const CreateLesson = () => {
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get("id");
  const [lessonTitle, setLessonTitle] = useState("");
  const [description, setDescription] = useState("");
  const [directions, setDirections] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;

      try {
        const lessonDoc = await getDoc(doc(db, "lessons", lessonId));
        if (lessonDoc.exists()) {
          const data = lessonDoc.data();
          setLessonTitle(data.lessonTitle);
          setDescription(data.description);
          setDirections(data.directions);
          setDifficulty(data.difficulty);
        }
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const lessonRef = doc(db, "lessons", lessonId);
      await updateDoc(lessonRef, {
        lessonTitle,
        description,
        directions,
        difficulty,
        updatedAt: Date.now()
      });

      navigate("/admin"); // or wherever your lessons list is
    } catch (error) {
      console.error("Error updating lesson:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="text-center mb-4">Edit Lesson</h1>
          <Form onSubmit={handleUpdateLesson}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Lesson Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter lesson title"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter lesson description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDirections">
              <Form.Label>Directions</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter directions for the AI. For Example: Pretend to have a conversation where you learn the basics about eachother."
                value={directions}
                onChange={(e) => setDirections(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDifficulty">
              <Form.Label>Difficulty</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter lesson difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Lesson"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateLesson;