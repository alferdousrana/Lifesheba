// src/routes/PublicRoute.js
import { Navigate } from 'react-router-dom';

function PublicRoute({ children }) {
    const token = localStorage.getItem('access_token');
    return token ? <Navigate to="/profile" /> : children;
}

export default PublicRoute;
