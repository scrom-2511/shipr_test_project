import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { token, user } = useAuth();

  return (
    <div className="home-hero">
      <h1>Notes</h1>
      <p className="home-tagline">
        A simple place to do xyz4.
      </p>
      {token && user ? (
        <div className="home-actions">
          <p className="home-greeting">
            Signed in as <strong>{user.name}</strong>
          </p>
          <Link to="/notes" className="btn primary">
            Open my notes
          </Link>
        </div>
      ) : (
        <div className="home-actions">
          <Link to="/login" className="btn primary">
            Log in
          </Link>
          <Link to="/signup" className="btn ghost">
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
