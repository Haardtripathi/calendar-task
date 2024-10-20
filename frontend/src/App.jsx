import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import AddEvent from './pages/AddEvent';

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/create-event" element={<AddEvent />} />


      </Routes>
    </Router>
  )
}

export default App
