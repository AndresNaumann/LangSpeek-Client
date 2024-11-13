import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from "../firebase"; // Import your Firebase configuration
import {
  collection,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  doc,
} from "firebase/firestore"; // Firestore methods
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase Auth

const Classroom = () => {
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [instructorId, setInstructorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [classCode, setClassCode] = useState("");
  const [classroomData, setClassroomData] = useState(null);
  const [lessons, setLessons] = useState([]);

  // First, Acquire the student information

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth(); // Get the auth instance
        const currentUser = auth.currentUser; // Get the current user

        if (currentUser) {
          const docRef = doc(db, "users", currentUser.uid); // Use current user's UID
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserData(userData);
            setEditData(userData); // Initialize editData with user data
            setClassCode(userData.course); // Set the classCode from user data
          } else {
            console.log("No such document!");
          }
        } else {
          console.log("No user is currently logged in.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchClassroomData = async () => {
      if (!classCode) return; // Wait for classCode to be set

      try {
        const classRef = collection(db, "classes");
        const q = query(classRef, where("code", "==", classCode)); // Query by classCode
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const classroomData = querySnapshot.docs[0].data(); // Assume one document per classCode
          setClassroomData(classroomData);
          setInstructorId(classroomData.instructorId);
        } else {
          console.log("No classroom found for this class code.");
        }
      } catch (error) {
        console.error("Error fetching classroom data:", error);
      }
    };

    const fetchLessons = async () => {
      try {
        const lessonRef = collection(db, "lessons");
        const q = query(lessonRef, where("lessonOwner", "==", instructorId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const lessonsData = querySnapshot.docs.map((doc) => doc.data());
          setLessons(lessonsData);
        } else {
          console.log("No lessons found for this instructor.");
        }
      } catch (error) {
        console.error("Error fetching lesson data.", error);
      }
    };

    fetchClassroomData();
    fetchLessons();
  }, [classCode]); // Only run when classCode changes

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Classroom Information</h1>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-header bg-success text-white">
            <h2 className="h5 mb-0">Class Details</h2>
          </div>
          <div className="card-body">
            {classroomData ? (
              <>
                <p>
                  <strong>Class Name:</strong> {classroomData.courseTitle}
                </p>
                <p>
                  <strong>Class Name:</strong> {classroomData.instructor}
                </p>
                <p>
                  <strong>Description:</strong> {classroomData.language}
                </p>

                {/* Add more fields if needed */}
              </>
            ) : (
              <p>No classroom data available.</p>
            )}
          </div>
          <div className="card-body">
            <div className="lessons-section mt-4">
              <h2 className="text-center mb-4">
                Lessons for Instructor {classroomData?.instructor}
              </h2>
              <div>
                {lessons.map((lesson, index) => (
                  <div key={index} className="card lesson-card shadow-sm mb-3">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title mb-1">
                          {lesson.lessonTitle || "Untitled Lesson"}
                        </h5>
                        <p className="card-text text-muted mb-0">
                          {lesson.description || "No description available."}
                        </p>
                      </div>
                      <button className="btn btn-primary btn-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classroom;
