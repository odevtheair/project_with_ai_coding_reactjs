import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Dashboard</h1>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.fullName || user?.username}!</h2>
          <p>You have successfully logged in and verified your PIN.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">🔐</div>
            <div className="stat-label">Authentication</div>
            <div className="stat-value">Verified</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div className="stat-label">PIN Status</div>
            <div className="stat-value">Confirmed</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">👤</div>
            <div className="stat-label">Account Status</div>
            <div className="stat-value">Active</div>
          </div>
        </div>

        <div className="info-card">
          <h3>Account Information</h3>
          <div className="info-item">
            <span className="info-label">Username:</span>
            <span className="info-value">{user?.username}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email}</span>
          </div>
          {user?.fullName && (
            <div className="info-item">
              <span className="info-label">Full Name:</span>
              <span className="info-value">{user.fullName}</span>
            </div>
          )}
          <div className="info-item">
            <span className="info-label">Security Status:</span>
            <span className="info-value">
              <span className="success-badge">Fully Authenticated</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
