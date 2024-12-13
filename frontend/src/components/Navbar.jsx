import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-gray-800 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo or Brand Name */}
                <div className="text-white text-xl font-bold">
                    <Link to="/">Calendar Task</Link>
                </div>

                {/* Navigation Links */}
                <ul className="flex space-x-6">
                    <li>
                        <Link
                            to="/"
                            className="text-white hover:text-gray-300 transition duration-200"
                        >
                            Home
                        </Link>
                    </li>
                    {!user ? (
                        <>
                            <li>
                                <Link
                                    to="/login"
                                    className="text-white hover:text-gray-300 transition duration-200"
                                >
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/register"
                                    className="text-white hover:text-gray-300 transition duration-200"
                                >
                                    Register
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <button
                                onClick={logout}
                                className="text-white hover:text-gray-300 transition duration-200"
                            >
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
