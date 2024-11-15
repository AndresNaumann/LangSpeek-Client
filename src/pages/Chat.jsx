import React, { useEffect, useState } from 'react';
import Recorder from "../components/recorder";
import { getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase Auth
import { db } from "../firebase"; // Adjust the path as necessary
import { useLocation } from "react-router-dom";

const Chat = () => {
    const [userData, setUserData] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const location = useLocation();
    const { lessonData } = location.state || {};

    //// ACQUIRE USER INFORMATION

    useEffect(() => {
      const fetchUserData = onAuthStateChanged(auth, async (currentUser) => {
          try {
              if (currentUser) {
                  const docRef = doc(db, 'users', currentUser.uid); // Use current user's UID
                  const docSnap = await getDoc(docRef);
  
                  if (docSnap.exists()) {
                      setUserData(docSnap.data());
                      setUserRole(docSnap.data().role); // Initialize editData with user data
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
      });
  
      return () => fetchUserData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {lessonData ? (
        <Recorder lessonData={lessonData} />
      ) : (
        <Recorder/>
      )}
      
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
  },
  header: {
    backgroundColor: "#282c34",
    padding: "20px",
    color: "white",
  },
  main: {
    margin: "20px 0",
  },
  footer: {
    marginTop: "20px",
    borderTop: "1px solid #ccc",
    paddingTop: "10px",
  },
};

export default Chat;
