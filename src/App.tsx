import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import TimeMarketplace from './pages/TimeMarketplace';

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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;