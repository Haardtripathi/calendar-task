import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AddEventPage from "./pages/AddEventPage";
import EventPage from "./pages/EventPage";
import UpdateEventPage from "./pages/UpdateEventPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />

            {/* Private Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-event"
              element={
                <PrivateRoute>
                  <AddEventPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/events"
              element={
                <PrivateRoute>
                  <EventPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/update-event/:id"
              element={
                <PrivateRoute>
                  <UpdateEventPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
