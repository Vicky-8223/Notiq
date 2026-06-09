import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import NotificationDetails from './pages/NotificationDetails';
import Examples from './pages/Examples';
import Architecture from './pages/Architecture';
import ApiDocs from './pages/ApiDocs';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="notifications/:eventId" element={<NotificationDetails />} />
          <Route path="examples" element={<Examples />} />
          <Route path="architecture" element={<Architecture />} />
          <Route path="api-docs" element={<ApiDocs />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
