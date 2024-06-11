import { Link } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import './Navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-container">
      <Link to="/" className="navbar-logo">
        <img src={Logo} alt="Logo" />
        <span className="sr-only">UPATECORP</span>
      </Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/board">Tableros</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
