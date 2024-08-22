import React from 'react';
import { useAuth } from '../security/AuthContext.jsx';
import {ReactComponent as HomeImage} from '../assets/home-image/home.svg';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
    const authContext = useAuth();
    const navigate = useNavigate();

    function handleWorkshopsClick() {
        navigate(`/workshops-admin`);
    }

    function handleBookingsClick() {
        navigate(`/bookings-admin`);
    }

    function handleDashboardClick() {
        navigate(`/dashboard-admin`);
    }

    return (
        <div className="home-container">
            <div className="art-animation">
                <HomeImage className="home-image" />
                <div className="show-name">Hi, {authContext.name}</div>
                <div className="show-tagline">Let's brush up on some artistic skills together</div>
            </div>
            <div className="services-container">
                <div className="service-box bottom-box" onClick={handleWorkshopsClick}>
                    <h2>Workshops</h2>
                    <p>Join our creative workshops to learn and explore various art forms.</p>
                </div>
                <div className="service-box bottom-box" onClick={handleBookingsClick}>
                    <h2>Bookings</h2>
                    <p>Book a slot for our expert-led workshops for a great experience.</p>
                </div>
                <div className="service-box bottom-box" onClick={handleDashboardClick}>
                    <h2>Dashboard</h2>
                    <p>Analyze your workshops and users insights.</p>
                </div>
            </div>
        </div>
    );
}