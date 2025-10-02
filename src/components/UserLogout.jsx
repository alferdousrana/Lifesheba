import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logoutGif from '../assets/images/logout_image.gif';
import { AuthContext } from '../contexts/AuthContext';

function UserLogout() {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null); // Clear context
        navigate('/login');
    };

    return (
        <div className="card my-4">
            <div className="card-body">
                <div className='row'>
                    <div className='col-md-6'>
                        <img src={logoutGif} alt="" style={{ objectFit: 'contain', height: '500px', width: '800px' }} />
                    </div>
                    <div className='col-md-6 d-flex align-items-center justify-content-center'>
                        <div className='text-center'>
                            <h3>Are you sure you want to log out?</h3>
                            <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserLogout;
