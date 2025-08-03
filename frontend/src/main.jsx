
const App = () => {
  const { KioskLayout } = window.Kiosk;
  const { BrowserRouter, Routes, Route } = window.ReactRouterDOM;

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
