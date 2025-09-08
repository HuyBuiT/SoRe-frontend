import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import TimeMarketplace from './pages/TimeMarketplace';
import KOLDashboard from './pages/KOLDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/dashboard" element={<AppPage />} />
          <Route path="/marketplace" element={<TimeMarketplace />} />
          <Route path="/time" element={<TimeMarketplace />} />
          <Route path="/kol-dashboard" element={<KOLDashboard />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
}

export default App;