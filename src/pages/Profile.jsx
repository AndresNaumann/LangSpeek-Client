import React, { useEffect, useState } from 'react';
import { getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { db } from "../firebase"; // Adjust the path as necessary
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '', phone: '', address: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const auth = getAuth(); // Get the auth instance
                const currentUser = auth.currentUser; // Get the current user

                if (currentUser) {
                    const docRef = doc(db, 'users', currentUser.uid); // Use current user's UID
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                        setEditData(docSnap.data()); // Initialize editData with user data
                    } else {
                        console.log('No such document!');
                    }
                } else {
                    console.log('No user is currently logged in.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleShowEditModal = () => {
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            const docRef = doc(db, 'users', currentUser.uid);

            await updateDoc(docRef, editData); // Update the user document
            setUserData(editData); // Update local state with new data
            handleCloseEditModal(); // Close the modal
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const handleDeleteAccount = async () => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            try {
                // First, delete the user from Firestore
                const docRef = doc(db, 'users', currentUser.uid);
                await deleteDoc(docRef);

                // Then, delete the user from Firebase Authentication
                await currentUser.delete();

                console.log('Account deleted successfully.');
                // You may want to navigate to a different page after deletion
                navigate('/'); 
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>No user data found</div>;
    }

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header">
                    <h3>User Profile</h3>
                </div>
                <div className="card-body">
                    <h5 className="card-title">{userData.name}</h5>
                    <p className="card-text"><strong>Email:</strong> {userData.email}</p>
                    <p className="card-text"><strong>Phone:</strong> {userData.phone}</p>
                    <p className="card-text"><strong>Address:</strong> {userData.address}</p>
                    <Button variant="primary" onClick={handleShowEditModal}>
                        Edit
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAccount}>
                        Delete Account
                    </Button>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={editData.name}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={editData.email}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={editData.phone}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={editData.address}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Profile;
