import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MainLayout: React.FC = () => {
  const { token, user, logout } = useAuth();

  return (
    <div className="shell">
      <header className="top-nav">
        <Link to="/" className="brand">
          Notes
        </Link>
        <nav className="top-nav-links">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          {token ? (
            <>
              <NavLink to="/notes" className="nav-link">
                My notes
              </NavLink>
              <span className="nav-user" title={user?.email ?? ""}>
                {user?.name}
              </span>
              <button type="button" className="btn text" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Log in
              </NavLink>
              <NavLink to="/signup" className="nav-link">
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
