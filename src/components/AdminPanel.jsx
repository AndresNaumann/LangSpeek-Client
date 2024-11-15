import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  arrayRemove,
  doc,
} from "firebase/firestore";
import { db } from "../firebase"; // Adjust the path as necessary
import { getAuth } from "firebase/auth"; // Import Firebase Auth

const AdminPanel = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState(null); // Optional: for handling errors
  const [success, setSuccess] = useState(null); // Optional: for success messages
  const [classData, setClassData] = useState(null);

  // Get all the students that the teacher oversees
  // Get the list of lessons that the teacher owns

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("role", "==", "student")
        );
        const querySnapshot = await getDocs(q);
        const studentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id, // uid
          ...doc.data(), // contains other properties
        }));
        setStudents(studentsList);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    const fetchLessons = async () => {
      try {
        const auth = getAuth(); // Get the auth instance
        const currentUser = auth.currentUser; // Get the current user
        const userId = currentUser.uid;

        const q = query(
          collection(db, "lessons"),
          where("lessonOwner", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        const lessonsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLessons(lessonsList);
      } catch (error) {
        console.error("Error fetching lessons:", error);
        setError("Failed to fetch lessons");
      }
    };

    fetchStudents();
    fetchLessons();
  }, []);

  // Handle the creation of a new lesson

  const handleCreateNewLesson = async () => {
    try {
      const auth = getAuth(); // Get the auth instance
      const userId = auth.currentUser?.uid;

      if (!userId) {
        setError("Please log in to create a lesson");
        return;
      }
  
      // Create a new document reference with a unique ID
      const newLessonId = userId + "-" + Date.now();
      const lessonRef = doc(db, "lessons", newLessonId);
  
      // Create the lesson with default values
      await setDoc(lessonRef, {
        lessonTitle: "New Lesson",
        description: "No description",
        difficulty: "No difficulty",
        lessonOwner: userId,
        createdAt: Date.now()
      });
  
      // Navigate to the edit page
      navigate(`/create-lesson?id=${newLessonId}`);
  
    } catch (error) {
      console.error("Error creating new lesson:", error);
      setError("Failed to create new lesson");
    }
  };

  const handleEditLesson = async (lessonId) => {

      navigate(`/edit-lesson?id=${lessonId}`);

  }

  // Delete a lesson from the lessons collection

  const handleDeleteLesson = async (lessonId) => {
    try {
      await deleteDoc(doc(db, "lessons", lessonId));
      setSuccess("Lesson deleted successfully!");
      // Update the lessons list
      setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
    } catch (error) {
      console.error("Error deleting lesson:", error);
      setError("Failed to delete lesson");
    }
  };

  const addStudent = () => {
    const newStudent = prompt("Enter student name:");
    if (newStudent) {
      setStudents([...students, newStudent]);
    }
  };

  // const handleRemoveStudent = async (studentId, classId) => {
  //   try {
  //     // Reference to the specific class document
  //     const classRef = doc(db, "classes", classId);

  //     // Update the class document by removing the student's ID from the "students" array
  //     await updateDoc(classRef, {
  //       students: arrayRemove(studentId),
  //     });

  //     setSuccess("Student removed from class successfully!");

  //     // Optionally, fetch the updated class data to refresh the UI
  //     const updatedClass = await getDoc(classRef);
  //     setClassData(updatedClass.data());
  //   } catch (error) {
  //     console.error("Error removing student from class:", error);
  //     setError("Failed to remove student from class.");
  //   }
  // };

  const handleRemoveStudent = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id)); // Delete the student document
      setSuccess("Student removed successfully!"); // Set success message

      // Optionally fetch students again to update the list
      const updatedStudents = await getDocs(
        query(collection(db, "users"), where("role", "==", "student"))
      );
      const studentsList = updatedStudents.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsList);
    } catch (error) {
      console.error("Error removing student:", error);
      setError("Failed to remove student.");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newLesson = e.target.result;
        setLessons([...lessons, newLesson]);
      };
      reader.readAsText(file);
    }
  };

  //////////ADMIN DASHBOARD////////////////////////////////////////////////////////////

  return (
    <div className="container mt-5">
      <ul className="nav nav-tabs" id="adminTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="students-tab"
            data-bs-toggle="tab"
            data-bs-target="#students"
            type="button"
            role="tab"
            aria-controls="students"
            aria-selected="true"
          >
            Students
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="lessons-tab"
            data-bs-toggle="tab"
            data-bs-target="#lessons"
            type="button"
            role="tab"
            aria-controls="lessons"
            aria-selected="false"
          >
            Lessons
          </button>
        </li>
      </ul>
      <div className="tab-content" id="adminTabContent">
        <div
          className="tab-pane fade show active"
          id="students"
          role="tabpanel"
          aria-labelledby="students-tab"
        >
          <h2 className="mt-3">Students</h2>
          <ul className="list-group">
            {students.map((student) => (
              <li
                key={student.id} // Use student ID as the key
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {student.name} {/* Display student name */}Student ID:{" "}
                {student.id}
                <div>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleRemoveStudent(student.id)} // Remove student by ID
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button className="btn btn-primary mt-3" onClick={addStudent}>
            Add Student
          </button>
        </div>
        <div
          className="tab-pane fade"
          id="lessons"
          role="tabpanel"
          aria-labelledby="lessons-tab"
        >
          <h2 className="mt-3">Your Lessons</h2>

          {/* Display any error or success messages */}
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Display lessons list */}
          <ul className="list-group">
            {lessons.map((lesson) => (
              <li
                key={lesson.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h5 className="mb-1">{lesson.lessonTitle}</h5>
                  <p>{lesson.description}</p>
                  <small>Difficulty: {lesson.difficulty}</small>
                </div>
                <div>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleEditLesson(lesson.id)}
                    style={{marginRight: "10px"}}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteLesson(lesson.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* What to show if there is no lesson found */}
          {lessons.length === 0 && (
            <p className="text-muted mt-3">
              No lessons found. Create your first lesson!
            </p>
          )}
          <br></br>
          <button
            className="btn btn-primary mb-3"
            onClick={handleCreateNewLesson}
          >
            Create New Lesson
          </button>

          <div className="mt-3">
            <label htmlFor="fileUpload" className="form-label">
              Upload Lesson
            </label>
            <input
              type="file"
              className="form-control"
              id="fileUpload"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
