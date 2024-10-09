// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { auth } from "../firebase";

const ProtectedRoute = ({ element: Component, requiredRole, ...rest }) => {
  const user = auth.currentUser;

  // You can fetch roles from Firestore or other methods based on your setup
  // Assuming `user.role` for role checking
  const userHasRequiredRole = user && user.role === requiredRole;

  if (!user) {
    // If the user is not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  if (!userHasRequiredRole) {
    // If the user doesn't have the required role, redirect to a forbidden or dashboard
    return <Navigate to="/forbidden" />; // Or wherever you want
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
