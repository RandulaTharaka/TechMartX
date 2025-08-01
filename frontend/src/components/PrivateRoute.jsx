import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  //The <Outlet /> component in your PrivateRoute is used as a placeholder for rendering child routes (in index.js, ShippingScreen in this case).
  // The 'replace' prop in <Navigate to="/login" replace /> tells React Router to replace the current entry in the browser’s history stack instead of adding a new one.
  // Pressing the browser’s "Back" button will not take them back to the protected page (since it was replaced).
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
