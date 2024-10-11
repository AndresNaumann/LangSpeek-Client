import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from "../firebase"; // Import your Firebase configuration
import { collection, getDocs, updateDoc, query, where, doc } from "firebase/firestore"; // Firestore methods
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

const JoinClass = () => {
    const [classCode, setClassCode] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleJoinClass = async (e) => {
        e.preventDefault(); // Prevent form submission

        setLoading(true);
        setMessage(''); // Reset message

        const auth = getAuth(); // Get the auth instance
        const user = auth.currentUser; // Get the current user

        if (!user) {
            setMessage('You must be logged in to join a class.');
            setLoading(false);
            return;
        }

        try {
            // Create a query to find classes with the matching code
            const classQuery = query(collection(db, 'classes'), where('code', '==', classCode));
            const querySnapshot = await getDocs(classQuery);

            if (!querySnapshot.empty) {
                // If a class with the provided code exists
                const classDoc = querySnapshot.docs[0]; // Get the first matching class
                const userId = user.uid; // Replace with actual user ID logic (e.g., from auth)
                
                // Update the class document to include the user ID in the students array
                await updateDoc(classDoc.ref, {
                    students: [...(classDoc.data().students || []), userId] // Append user ID to the students array
                });

                const userRef = doc(db, 'users', user.uid); // Get the user document reference
                await updateDoc(userRef, { role: 'student' }); // Update the user role to student

                setMessage('Successfully joined the class!');
                navigate('/'); // Redirect to home page after joining
            } else {
                setMessage('Class code not found. Please try again.');
            }
        } catch (error) {
            console.error('Error joining class:', error);
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center">Join a Class</h3>
                            {message && <div className="alert alert-info">{message}</div>} {/* Display message */}
                            <form onSubmit={handleJoinClass}>
                                <div className="form-group">
                                    <label htmlFor="classCode">Class Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="classCode"
                                        placeholder="Enter class code"
                                        value={classCode}
                                        onChange={(e) => setClassCode(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block mt-3" disabled={loading}>
                                    {loading ? 'Joining...' : 'Join'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinClass;
