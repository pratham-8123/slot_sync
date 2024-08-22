import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from '../security/AuthContext.jsx';
import Landing from './Landing.jsx';
import Home from './Home.jsx';
import HomeAdmin from './HomeAdmin.jsx';
import Workshops from './Workshops.jsx';
import WorkshopsAdmin from './WorkshopsAdmin.jsx';
import Bookings from './Bookings.jsx';
import BookingsAdmin from './BookingsAdmin.jsx';
import Favorites from './Favorites.jsx';
import DashboardAdmin from './DashboardAdmin.jsx';
import Profile from './Profile.jsx';
import Error from './Error.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import Logout from './Logout.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './SlotSyncApp.css';

function LoggedInRoute({ children }) {
    const authContext = useAuth();

    if (authContext.isLoggedIn) {
        return children;
    } else {
        return <Navigate to="/" />;
    }
}

function LoggedOutRoute({ children }) {
    const authContext = useAuth();

    if (authContext.isLoggedIn) {
        authContext.logout();
    }
    return children;
}

export default function SlotSyncApp() {
    return (
        <div className="slotsync">
        <AuthProvider>
            <BrowserRouter>
                <Header />
                <div className="content">
                    <Routes>
                        <Route path='/' element={ <LoggedOutRoute><Landing /></LoggedOutRoute> } />
                        <Route path='/login' element={ <LoggedOutRoute><Login /></LoggedOutRoute> } />
                        <Route path='/signup' element={ <LoggedOutRoute><Signup /></LoggedOutRoute> } />
                        <Route path='/home' element={ <LoggedInRoute><Home /></LoggedInRoute> } />
                        <Route path='/home-admin' element={ <LoggedInRoute><HomeAdmin /></LoggedInRoute> } />
                        <Route path='/workshops' element={ <LoggedInRoute><Workshops /></LoggedInRoute> } />
                        <Route path='/workshops-admin' element={ <LoggedInRoute><WorkshopsAdmin /></LoggedInRoute> } />
                        <Route path='/bookings' element={ <LoggedInRoute><Bookings /></LoggedInRoute> } />
                        <Route path='/bookings-admin' element={ <LoggedInRoute><BookingsAdmin /></LoggedInRoute> } />
                        <Route path='/favorites' element={ <LoggedInRoute><Favorites /></LoggedInRoute> } />
                        <Route path='/dashboard-admin' element={ <LoggedInRoute><DashboardAdmin /></LoggedInRoute> } />
                        <Route path='/profile' element={ <LoggedInRoute><Profile /></LoggedInRoute> } />
                        <Route path='/logout' element={ <LoggedInRoute><Logout /></LoggedInRoute> } />
                        <Route path='*' element={ <Error />} />
                    </Routes>
                </div>
                <Footer />
            </BrowserRouter>
        </AuthProvider>
    </div>
    );
}