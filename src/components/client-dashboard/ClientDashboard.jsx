import React from "react";
import Navbar from "./navbar/Navbar";

const ClientDashboard = () => {
  return (
    <div className="container-fluid p-2 p-md-3 p-lg-4">
      <div className="row no-gutters">
        <div className="col-12">
          <Navbar></Navbar>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
