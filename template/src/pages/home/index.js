import React from 'react';
import './index.css';
import Dashboard from '@material-ui/icons/Dashboard';
import NoEncryption from '@material-ui/icons/NoEncryption';
import { Link } from 'react-router-dom';
import { useStateStore } from '../../services/State';

export default function HomePage() {
    const [user] = useStateStore('userProfile');

    return (
        <section id="homePage" className="col-md-6 col-md-offset-3">
            <header>
                <h2>Welcome, {user.name?.fullName}!</h2>
            </header>
            <main>
                {user.modules.indexOf('POLICE_ACTIVITY_REPORT') !== -1 && 
                    <React.Fragment>
                        <Link to={`/404`}>
                            <Dashboard color="primary" />
                            404
                        </Link>
                    </React.Fragment>
                }
                <Link to="/permissions" style={{color: 'green'}}>
                    <NoEncryption/>
                    Permissions
                </Link>
            </main>
            <footer>
                
            </footer>
        </section>
    );
}