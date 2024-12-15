import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    // Custom decode function for JWTs
    const decodeJWT = (token) => {
        try {
            const payload = token.split(".")[1];
            const decodedPayload = atob(payload); // Decode Base64
            return JSON.parse(decodedPayload); // Parse JSON
        } catch (error) {
            console.error("Error decoding JWT:", error);
            return null; // Return null on error
        }
    };

    useEffect(() => {
        const authenticateUser = () => {
            try {
                const currentUrl = window.location.href;
                // console.log("Full URL on load:", currentUrl);

                const url = new URL(currentUrl);
                const token = url.searchParams.get("token");
                // console.log("Extracted Token:", token);

                if (token) {
                    // Save the token to localStorage
                    localStorage.setItem("token", token);
                    // console.log("Token saved to localStorage.");

                    // Decode the token payload
                    const payload = decodeJWT(token);
                    // console.log("Decoded Payload:", payload);

                    if (payload) {
                        setUser({ userId: payload.userId, email: payload.email });
                    }

                    // Clean up the URL
                    window.history.replaceState({}, document.title, "/");
                } else {
                    // Check for a saved token in localStorage
                    const savedToken = localStorage.getItem("token");
                    if (savedToken) {
                        const payload = decodeJWT(savedToken);
                        // console.log("Loaded user from localStorage:", payload);

                        if (payload) {
                            setUser({ userId: payload.userId, email: payload.email });
                        }
                    } else {
                        console.log("No token found. User not authenticated.");
                    }
                }
            } catch (error) {
                console.error("Error during authentication:", error);
            } finally {
                setIsAuthenticating(false);
            }
        };

        authenticateUser();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        console.log("User logged out.");
    };

    const login = async (email, password) => {
        try {
            const response = await fetch("https://calendar-task-gauth.onrender.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            const data = await response.json();
            const { token } = data;

            // Save token and set user state
            localStorage.setItem("token", token);
            const payload = decodeJWT(token);
            setUser({ userId: payload.userId, email: payload.email });
        } catch (error) {
            console.error("Login failed:", error.message);
            throw error; // Propagate error to the form
        }
    };


    if (isAuthenticating) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, logout, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
