import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { KioskLayout } from './components/layouts';
import {
  Home,
  Announcement,
  Search,
  Map,
  Directory,
  Queue,
  FAQ,
  Help
} from './components/pages';

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <KioskLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/announcement" element={<Announcement />} />
          <Route path="/search" element={<Search />} />
          <Route path="/map" element={<Map />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </KioskLayout>
    </Router>
  );
}

export default App;