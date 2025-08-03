import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { KioskLayout } from './components/layouts';

function App() {
  return (
    <Router>
      <KioskLayout>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/announcement" element={<div>Announcement</div>} />
          <Route path="/search" element={<div>Search</div>} />
          <Route path="/map" element={<div>Map</div>} />
          <Route path="/directory" element={<div>Directory</div>} />
          <Route path="/queue" element={<div>Queue</div>} />
          <Route path="/faq" element={<div>FAQs</div>} />
          <Route path="/help" element={<div>Help</div>} />
        </Routes>
      </KioskLayout>
    </Router>
  );
}

export default App;