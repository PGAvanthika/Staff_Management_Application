import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ManagerDashboard from './components/ManagerDashboard';
import ManagerDueExtensions from './components/ManagerDueExtensions';

function App() {
  const [user, setUser] = React.useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} />} />
        
        {/* Manager Routes */}
        {user?.role === 'Manager' && (
          <>
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/manager/dues" element={<ManagerDueExtensions />} />
          </>
        )}

        {/* Redirect to appropriate dashboard based on role */}
        <Route
          path="/"
          element={
            user ? (
              user.role === 'Manager' ? (
                <Navigate to="/manager" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App; 