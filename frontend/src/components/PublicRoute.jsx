import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PublicRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user !== null) {
        console.log("PublicRoute: User authenticated. Redirecting to home.");
        return <Navigate to="/" />;
    }

    console.log("PublicRoute: No authenticated user.");
    return children;
};

export default PublicRoute;
