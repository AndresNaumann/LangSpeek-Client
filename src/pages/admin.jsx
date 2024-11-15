import React from "react";

import AdminPanel from "../components/AdminPanel";
import "bootstrap/dist/css/bootstrap.min.css";

const Admin = () => {

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div>
            <div className="card-body">
              <h1 className="card-title text-center">Admin Dashboard</h1>
              <AdminPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
