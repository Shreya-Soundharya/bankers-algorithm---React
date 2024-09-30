import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Calculator from './components/Calculator';
import Introduction from './components/Introduction';
import Pseudocode from './components/Pseudocode';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/introduction" />} />
            <Route path="/introduction" element={<Introduction />} />
            <Route path="/pseudocode" element={<Pseudocode />} />
            <Route path="/calculator" element={<Calculator />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
