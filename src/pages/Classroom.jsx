import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from "../firebase"; // Import your Firebase configuration
import { collection, getDocs, updateDoc, query, where, doc } from "firebase/firestore"; // Firestore methods
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

const Classroom = () => {
    return (
        <div>
            <h1>Classroom</h1>
        </div>
    );
}

export default Classroom;
