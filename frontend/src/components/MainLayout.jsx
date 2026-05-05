import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const primaryLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
];

function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isProvider = user?.role === 'provider' || user?.role === 'admin';

  return (
    <div className="app-shell">
      <header className="shell-header">
        <div className="shell-header__inner">
          <Link className="brand-mark" to="/">
            <span className="brand-mark__pulse" />
            <div>
              <strong>QuickServe</strong>
              <span>Fast local help, beautifully booked.</span>
            </div>
          </Link>

          <button
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`nav-drawer ${menuOpen ? 'is-open' : ''}`}>
            <nav className="main-nav">
              {primaryLinks.map((link) => (
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'is-active' : ''}`
                  }
                  key={link.to}
                  to={link.to}
                >
                  {link.label}
                </NavLink>
              ))}
              {user && (
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'is-active' : ''}`
                  }
                  to="/bookings"
                >
                  Bookings
                </NavLink>
              )}
              {isProvider && (
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'is-active' : ''}`
                  }
                  to="/upload"
                >
                  Add Service
                </NavLink>
              )}
              {user?.role === 'admin' && (
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'is-active' : ''}`
                  }
                  to="/admin"
                >
                  Admin
                </NavLink>
              )}
            </nav>

            <div className="nav-actions">
              {user ? (
                <>
                  <div className="user-chip">
                    <span className="user-chip__avatar">
                      {user.name?.charAt(0)?.toUpperCase() ?? 'Q'}
                    </span>
                    <div>
                      <strong>{user.name}</strong>
                      <span>{user.role}</span>
                    </div>
                  </div>
                  <button className="button button--ghost" onClick={logout} type="button">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link className="button button--ghost" to="/login">
                    Sign in
                  </Link>
                  <Link className="button button--primary" to="/register">
                    Join QuickServe
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>

      <footer className="shell-footer">
        <div className="shell-footer__inner">
          <div>
            <strong>QuickServe</strong>
            <p>
              A responsive marketplace for trusted home services, built for fast
              discovery and smoother bookings.
            </p>
          </div>
          <div className="footer-grid">
            <Link to="/services">Browse services</Link>
            <Link to="/register">Create account</Link>
            <Link to="/upload">List a service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
