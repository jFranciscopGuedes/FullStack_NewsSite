import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/NavBar.css";

function NavBar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">NEWS</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-bar-link">Home</Link>

        {token && <Link to="/LikedNews" className="nav-bar-link">Liked News</Link>} {/*Se logado,com token, aparece a opcao */}
        
        {/*Se for Jornalista */}

        {role=== "jornalista" && (
          <Link to="/admin/news" className="nav-bar-link">Gerir Noticias</Link>
        )}

        {token ? (
          <>
            <Link to="/profile" className="nav-bar-link">Profile</Link>
            <button onClick={handleLogout} className="nav-bar-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-bar-link">Login</Link>
            <Link to="/register" className="nav-bar-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
