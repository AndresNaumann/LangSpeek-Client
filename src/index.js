// index.js

import React from "react";
import ReactDOM from "react-dom/client"; // Import from 'react-dom/client'
import App from "./App"; // Import your root component (App)
import { BrowserRouter } from "react-router-dom"; // If using routing

// Create a root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app inside the root element
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* Wrap in BrowserRouter if using routing */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
