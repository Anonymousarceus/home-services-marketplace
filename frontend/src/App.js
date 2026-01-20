import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import CustomerBooking from './pages/CustomerBooking';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('customer');
  

  return (
    <AppProvider>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-brand">
            <h1>ServiceHub Pro</h1>
            <p className="tagline">Professional Home Services Platform</p>
          </div>
          <div className="navbar-menu">
            <button
              className={`nav-button ${currentView === 'customer' ? 'active' : ''}`}
              onClick={() => setCurrentView('customer')}
            >
              <span className="nav-icon">👤</span>
              Customer Portal
            </button>
            <button
              className={`nav-button ${currentView === 'provider' ? 'active' : ''}`}
              onClick={() => setCurrentView('provider')}
            >
              <span className="nav-icon">🔧</span>
              Provider Dashboard
            </button>
            <button
              className={`nav-button ${currentView === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentView('admin')}
            >
              <span className="nav-icon">⚙️</span>
              Admin Panel
            </button>
          </div>
        </nav>

        <main className="main-content">
          {currentView === 'customer' && <CustomerBooking />}
          {currentView === 'provider' && <ProviderDashboard />}
          {currentView === 'admin' && <AdminPanel />}
        </main>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-left">
              <h3>ServiceHub Pro</h3>
              <p>Connecting customers with trusted service providers</p>
            </div>
            <div className="footer-right">
              <p>© 2026 ServiceHub Pro. All rights reserved.</p>
              <p>Powered by advanced booking management technology</p>
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;
