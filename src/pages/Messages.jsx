import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Import your Firebase configuration
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
} from "firebase/firestore"; // Firestore methods
import { useParams } from "react-router-dom"; // To get URL params
import { ToastContainer, toast } from "react-toastify";

const Messages = () => {
    const { conversationId } = useParams(); // Get the conversation ID from URL
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch messages in chronological order
    const fetchMessages = async () => {
        try {
            const messagesRef = collection(db, "messages");
            const q = query(
                messagesRef,
                where("conversationId", "==", conversationId),
                orderBy("timestamp") // Order messages by timestamp
            );

            const querySnapshot = await getDocs(q);
            const messagesList = [];

            querySnapshot.forEach((doc) => {
                messagesList.push({ id: doc.id, ...doc.data() });
            });

            setMessages(messagesList);
        } catch (error) {
            console.error("Error fetching messages: ", error);
            toast.error("Failed to load messages.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [conversationId]);

    if (loading) return <div>Loading messages...</div>;

    return (
        <div className="container">
            <h3 className="my-4">Messages for Conversation ID: {conversationId}</h3>

            {messages.length > 0 ? (
                <div className="conversation-container border rounded p-3 mb-3" style={{ maxHeight: "100vh", maxWidth: "100vh", overflowY: "auto" }}>
                    {messages.map((message) => (
                        <div key={message.id} className={`d-flex ${message.sender === "user" ? "justify-content-end" : ""}`}>
                            <span
                                className={`p-2 rounded ${message.sender === "user" ? "bg-primary text-white" : "bg-light text-dark"}`}
                                style={{ maxWidth: "70%", wordWrap: "break-word" }}
                            >
                                {message.text}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div>No messages found for this conversation.</div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Messages;
