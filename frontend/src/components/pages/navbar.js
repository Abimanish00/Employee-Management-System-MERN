import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className="nav-bar">
      <Link to="/" className="nav-logo">EMS</Link>
      <ul className="nav-content">
        {!token ? (
          <>
            <li className="nav-element">
              <Link to="/signup" className="nav-btn">Signup</Link>
            </li>
            <li className="nav-element">
              <Link to="/login" className="nav-btn">Login</Link>
            </li>
          </>
        ) : (
          <>
            <li className="nav-element">
              <Link to="/dashboard" className="nav-btn">Dashboard</Link>
            </li>
            <li className="nav-element">
              <button className="nav-btn" onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
