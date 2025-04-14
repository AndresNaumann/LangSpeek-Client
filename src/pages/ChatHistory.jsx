import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from "../firebase"; // Import your Firebase configuration
import {
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore"; // Firestore methods
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ChatHistory = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    const auth = getAuth();
    const userId = auth.currentUser?.uid; // Get the current user's UID
    const navigate = useNavigate(); // Set up navigation

    // Fetch conversations where userId matches the logged-in user's UID
    const fetchConversations = async () => {
        try {
            const conversationsRef = collection(db, "conversations");
            const q = query(conversationsRef, where("userId", "==", userId));

            const querySnapshot = await getDocs(q);
            const conversationsList = [];

            querySnapshot.forEach((doc) => {
                conversationsList.push({ id: doc.id, ...doc.data() });
            });

            setConversations(conversationsList);
        } catch (error) {
            console.error("Error fetching conversations: ", error);
            toast.error("Failed to load conversations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch conversations when component mounts
        if (userId) {
            fetchConversations();
        }
    }, [userId]);

    if (loading) return <div>Loading conversations...</div>;

    // Navigate to the Messages page for a specific conversation
    const handleViewMessages = (conversationId) => {
        navigate(`/messages/${conversationId}`);
    };

    return (
        <div className="container">
            <h3 className="my-4">Your Chat History</h3>

            {conversations.length > 0 ? (
                <ul className="list-group">
                    {conversations
                        .filter((conversation) => {
                            const startTime = conversation.startTime?.seconds;
                            const conversationDate = new Date(startTime * 1000);
                            const aprilFirst = new Date('2025-04-01T00:00:00');
                            return conversationDate > aprilFirst;
                        })
                        .map((conversation) => (
                            <li key={conversation.id} className="list-group-item">
                                <div>
                                    <strong>Conversation ID:</strong> {conversation.id}
                                </div>
                                <div>
                                    <strong>Type:</strong> {conversation.lessonId}
                                </div>
                                <div>
                                    <strong>Start Time:</strong> {new Date(conversation.startTime?.seconds * 1000).toLocaleString()}
                                </div>
                                <button
                                    className="btn btn-primary mt-2"
                                    onClick={() => handleViewMessages(conversation.id)}
                                >
                                    View Messages
                                </button>
                            </li>
                        ))}
                </ul>
            ) : (
                <div>No conversations found.</div>
            )}

            <ToastContainer />
        </div>
    );
};

export default ChatHistory;
