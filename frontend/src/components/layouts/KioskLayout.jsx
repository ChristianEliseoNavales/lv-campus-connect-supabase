const KioskLayout = ({ children }) => {
  const { useState, useEffect } = React;
  const { NavLink } = ReactRouterDOM;
  const { HomeIcon, AnnouncementIcon, SearchIcon, MapIcon, DirectoryIcon, QueueIcon, FaqIcon } = window.Icons;

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100" style={{ aspectRatio: '16/9' }}>
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Add logo here */}
          <h1 className="text-xl ml-2">LVCampusConnect</h1>
        </div>
        <div className="rounded-lg bg-white text-blue-900 p-2">
          <p>{time.toLocaleDateString()}</p>
          <p>{time.toLocaleTimeString()}</p>
        </div>
      </header>
      <main className="flex-grow p-4">{children}</main>
      <footer className="bg-blue-900 text-white p-4 flex justify-center items-center">
        <nav className="flex space-x-4">
          <NavLink to="/" className="flex items-center bg-blue-900 text-white px-4 py-2 rounded-full">
            <HomeIcon />
            <span className="ml-2">HOME</span>
          </NavLink>
          <NavLink to="/announcement" className="flex items-center bg-blue-900 text-white px-4 py-2 rounded-full">
            <AnnouncementIcon />
            <span className="ml-2">ANNOUNCEMENT</span>
          </NavLink>
          <NavLink to="/search" className="flex items-center bg-blue-900 text-white px-4 py-2 rounded-full">
            <SearchIcon />
            <span className="ml-2">SEARCH</span>
          </NavLink>
          <NavLink to="/map" className="flex items-center bg-blue-900 text-white px-4 py-2 rounded-full">
            <MapIcon />
            <span className="ml-2">MAP</span>
          </NavLink>
          <NavLink to="/directory" className="flex items-center bg-blue-900 text-white px-4 py-2 rounded-full">
            <DirectoryIcon />
            <span className="ml-2">DIRECTORY</span>
          </NavLink>
          <NavLink to="/queue" className="flex items-center bg-blue-900 text-white px-4 py-2 rounded-full">
            <QueueIcon />
            <span className="ml-2">QUEUE</span>
          </NavLink>
          <NavLink to="/faq" className="flex items-center bg-blue-900 text-white px-4 py-2 rounded-full">
            <FaqIcon />
            <span className="ml-2">FAQs</span>
          </NavLink>
          <NavLink to="/help" className="bg-blue-900 text-white rounded-full w-10 h-10 flex items-center justify-center">
            ?
          </NavLink>
        </nav>
      </footer>
    </div>
  );
};

window.Kiosk = { KioskLayout };