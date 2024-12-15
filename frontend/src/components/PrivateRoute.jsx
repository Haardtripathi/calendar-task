import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user === null) {
        console.log("PrivateRoute: User not authenticated. Redirecting to login.");
        return <Navigate to="/login" />;
    }

    console.log("PrivateRoute: User authenticated.");
    return children;
};

export default PrivateRoute;
