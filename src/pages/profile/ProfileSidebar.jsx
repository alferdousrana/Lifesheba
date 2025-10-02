import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

function ProfileSidebar() {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const role = user?.role || 'guest';

    const isActive = (path) => location.pathname === `/profile${path}`;

    const commonLinks = [
        { to: '', label: 'My Profile' }, // 👈 index route
    ];

    const roleLinks = {
        customer: [
            
            { to: '/appointments', label: 'My Appointments' },
            { to: '/bookings', label: 'My Care Bookings' },
            { to: '/test-bookings', label: 'My Test Bookings' },
            { to: '/orders', label: 'My Orders' },
        ],
        vendor: [
            { to: '/products', label: 'My Products' },
            { to: '/create-product', label: 'Create Product' },
            { to: '/vendor-orders', label: 'My Orders' },
            { to: '/stock', label: 'My Stock' },
        ],
        doctor: [
            { to: '/appointments', label: 'Appointments' },
            { to: '/doctor-history', label: 'History' },
        ],
        caregiver: [
            { to: '/bookings', label: 'My Bookings' },
        ],
        nurse: [
            { to: '/bookings', label: 'My Bookings' },
        ],
        technician: [
            { to: '/lab-reports', label: 'Lab Reports' },
        ],
        deliveryman: [
            { to: '/orders', label: 'Orders' },
        ],
      };

    const links = [...commonLinks, ...(roleLinks[role] || [])];

    return (
        <div className="p-3 bg-light border rounded" style={{ minWidth: '220px' }}>
            <h5 className="mb-3 text-capitalize">{role} Dashboard</h5>
            <ul className="list-group list-group-flush">
                {links.map((link) => (
                    <li key={link.to} className="list-group-item px-0 py-2">
                        <Link
                            to={`/profile${link.to}`}
                            className={`text-decoration-none ${isActive(link.to) ? 'fw-bold text-primary' : 'text-dark'}`}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProfileSidebar;
