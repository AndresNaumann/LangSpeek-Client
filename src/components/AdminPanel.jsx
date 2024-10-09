import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminPanel = () => {
  const [students, setStudents] = useState(["John Doe", "Jane Smith"]);
  const [lessons, setLessons] = useState(["Math", "Science"]);

  const addStudent = () => {
    const newStudent = prompt("Enter student name:");
    if (newStudent) {
      setStudents([...students, newStudent]);
    }
  };

  const removeStudent = (index) => {
    const newStudents = students.filter((_, i) => i !== index);
    setStudents(newStudents);
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
            {students.map((student, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {student}
                <div>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => removeStudent(index)}
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
          <h2 className="mt-3">Lessons</h2>
          <ul className="list-group">
            {lessons.map((lesson, index) => (
              <li key={index} className="list-group-item">
                {lesson}
              </li>
            ))}
          </ul>
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
