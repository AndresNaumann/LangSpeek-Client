import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore"; // Firestore methods
import { db } from "../firebase"; // Import Firestore instance

const ProtectedRoute = ({ element: Component, requiredRoles, ...rest }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserRole = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch the user document from Firestore
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // Set the role from the fetched document
            setUserRole(docSnap.data().role);
            console.log(docSnap.data().role);
          } else {
            console.error("No such user document!");
            setError("No role found for user.");
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
          setError("Error fetching user role.");
        }
      } else {
        console.log("No user is currently logged in.");
        setUserRole(null); // Clear userRole if no user is logged in
      }
      setLoading(false);
    });

    return () => fetchUserRole();
  }, [auth]);

  if (loading) {
    return (
      <div>
        <div style={{ margin: "20px" }}>Authenticating User...</div>
      </div>
    ); // Display a loading state while fetching role
  }

  if (!auth.currentUser) {
    // If the user is not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  if (!requiredRoles.includes(userRole)) {
    // If the user doesn't have the required role, redirect to forbidden
    return <Navigate to="/forbidden" />;
  }

  // Render the protected component if user has the required role
  return <Component {...rest} />;
};

export default ProtectedRoute;
