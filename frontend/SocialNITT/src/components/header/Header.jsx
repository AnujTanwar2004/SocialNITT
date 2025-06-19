import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import favicon from '../assets/favicon.png';
import burgerBar from '../assets/burger-bar.png';
import NotificationBell from '../notification/Notification'

function Header() {
  const auth = useSelector(state => state.auth);
  const { user, isLogged } = auth;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get('/user/logout');
      localStorage.removeItem('firstLogin');
      localStorage.removeItem('accessToken');
      window.location.href = '/';
    } catch (err) {
      window.location.href = '/';
    }
  };

  const userLink = () => (
    <li className="drop-nav">
      <Link to="#" className="avatar">
        <img src={user.avatar} alt="" /> {user.name} <i className="fas fa-angle-down"></i>
      </Link>
      <ul className="dropdown">
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
      </ul>
    </li>
  );

  const navLinks = (
    <>
      <li><Link to="/">🏠 Home</Link></li>
      <li><Link to="/products">🛍️ Products</Link></li>
      <li><Link to="/services">🔧 Services</Link></li>
      <li><Link to="/foods">🤤 Food</Link></li>
       <NotificationBell />
    </>
  );

  return (
    <header>
      <div className="logo">
        <Link to="/"><img src={favicon} alt="logo" /></Link>
        <Link to="/"><h1>SocialNITT</h1></Link>
      </div>

      {/* Updated: navLinks + userLink always rendered here */}
      <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
        {isLogged ? (
          <>
            {navLinks}
            {userLink()}
          </>
        ) : (
          <li><Link to="/login"><i className="fas fa-user"></i> Sign in</Link></li>
        )}
      </ul>

      <div className="menu-controls">
        
        <img
          src={burgerBar}
          alt="Menu"
          className="burger-icon"
          onMouseEnter={() => setMenuOpen(!menuOpen)}
        />
      </div>
    </header>
  );
}

export default Header;
