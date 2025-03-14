import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import ProfilePage from './ProfilePage';
import GraphComponent from './GraphComponents';
import HeaderComponent from './HeaderComponent';
import FooterComponent from './FooterComponent';

function App() {
  return (
    <Router>
      <div className="App">
        <HeaderComponent />
        <Routes>
          <Route path="/" element={<GraphComponent />} />
          <Route path="/profil" element={<ProfilePage />} />
        </Routes>
        <FooterComponent />
      </div>
    </Router>
  );
}

export default App;
