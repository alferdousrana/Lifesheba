import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import ProfileSidebar from './ProfileSidebar';
import { AuthContext } from '../../contexts/AuthContext';

function UserProfile() {
    const { user } = useContext(AuthContext);

    return (
        <div className="mx-5 mt-5">
            <div className="row">
                <div className="col-md-3">
                    <ProfileSidebar role={user?.role} />
                </div>
                <div className="col-md-9">
                    <Outlet /> {/* Nested content renders here */}
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
