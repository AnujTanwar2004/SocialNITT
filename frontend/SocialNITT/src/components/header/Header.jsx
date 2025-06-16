import React from 'react'
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import axios from 'axios'
import favicon from '../assets/favicon.png'

function Header() {
    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth

    const handleLogout = async () => {
        try {
            await axios.get('/user/logout')
            localStorage.removeItem('firstLogin')
            localStorage.removeItem('accessToken')
            window.location.href = "/";
        } catch (err) {
            window.location.href = "/";
        }
    }

    const userLink = () => {
        return <li className="drop-nav">
            <Link to="#" className="avatar">
            <img src={user.avatar} alt=""/> {user.name} <i className="fas fa-angle-down"></i>
            </Link>
            <ul className="dropdown">
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
            </ul>
        </li>
    }

    const loggedInNavigation = () => {
        return (
            <>  
                <li><Link to="/" >Home</Link></li>
                <li><Link to="/products">🏠 Products</Link></li>
                <li><Link to="/services">🔧 Services</Link></li>
                <li><Link to="/foods">🤤 Food</Link></li>
                {userLink()}
            </>
        )
    }

    const loggedOutNavigation = () => {
        return <li><Link to="/login"><i className="fas fa-user"></i> Sign in</Link></li>
    }

    const transform = {
        transform: isLogged ? "translateY(-5px)" : 0
    }

    return (
        <header>
            <div className="logo">
                <Link to="/">
                    <img src={favicon} alt="logo" />
                </Link>
                <Link to="/">
                    <h1>SocialNITT</h1>
                </Link>
            </div>

            <ul style={transform}>
                {isLogged ? loggedInNavigation() : loggedOutNavigation()}
            </ul>
        </header>
    )
}

export default Header
