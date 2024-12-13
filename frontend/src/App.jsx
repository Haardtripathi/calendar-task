// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import MainLayout from "./layouts/MainLayout";
// import LoginPage from "./components/LoginPage";
// import RegisterPage from "./components/RegisterPage";
// import { AuthProvider, AuthContext } from "./context/AuthContext";
// import { useContext } from "react";
// import { Navigate } from "react-router-dom";

// function App() {
//   const { authToken } = useContext(AuthContext);
//   return (
//     <AuthProvider>
//       <Router>
//         <MainLayout>
//           <Routes>
//             <Route path="/login" element={!authToken ? <LoginPage /> : <Navigate to="/" />} />
//             <Route path="/register" element={!authToken ? <RegisterPage /> : <Navigate to="/" />} />
//             <Route
//               path="/"
//               element={authToken ? <h1>Welcome to the Home Page</h1> : <Navigate to="/login" />}
//             />
//             <Route
//               path="/protected"
//               element={authToken ? <h1>Protected Content</h1> : <Navigate to="/login" />}
//             />
//           </Routes>
//         </MainLayout>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import HomePage from "./components/HomePage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
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
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomePage />
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