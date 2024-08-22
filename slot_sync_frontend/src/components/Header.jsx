import React from 'react';
import PaletteSyncLogo from '../assets/logo/PaletteSyncLogo.png';
import { ReactComponent as ProfileIcon } from '../assets/icons/profileIcon.svg';
import { useAuth } from '../security/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
    const authContext = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        authContext.logout();
        navigate(`/`);
    }

    return (
        <header className={`header ${!authContext.isLoggedIn ? 'centered' : ''}`}>
            <div className="header-left">
                <img src={PaletteSyncLogo} alt="Logo" className="logo" />
                <span className="logo-text">
                    <span className="logo-text-palette">Palette</span>
                    <span className="logo-text-sync">Sync</span>
                </span>
            </div>
            <nav className="header-center">
                {authContext.isLoggedIn && authContext.role === 'ROLE_USER' && (
                    <>
                        <Link to="/home" className="nav-link">Home</Link>
                        <Link to="/workshops" className="nav-link">Workshops</Link>
                        <Link to="/bookings" className="nav-link">Bookings</Link>
                        <Link to="/favorites" className="nav-link">Favourites</Link>
                    </>
                )}
                {authContext.isLoggedIn && authContext.role === 'ROLE_ADMIN' && (
                    <>
                        <Link to="/home-admin" className="nav-link">Home</Link>
                        <Link to="/workshops-admin" className="nav-link">Workshops</Link>
                        <Link to="/bookings-admin" className="nav-link">Bookings</Link>
                        <Link to="/dashboard-admin" className="nav-link">Dashboard</Link>
                    </>
                )}
            </nav>
            {authContext.isLoggedIn && (
                <div className="header-right">
                    <Link to="/profile" className="nav-link"><ProfileIcon className="profile-icon" /></Link>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            )}
        </header>
    );
}