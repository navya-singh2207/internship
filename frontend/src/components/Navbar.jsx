import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { token, logout } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return null;
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__logo">TaskFlow</div>
        {token && (
          <button type="button" className="btn btn--ghost" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
