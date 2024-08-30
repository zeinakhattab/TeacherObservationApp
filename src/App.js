import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AppContent from './components/AppContent';
import Success from './components/Success';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/app" element={<AppContent />} />
        <Route path="/success" element={<Success />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;