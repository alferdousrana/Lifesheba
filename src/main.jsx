import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext'; // ✅ Import CartContext

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>  {/* ✅ Wrap App with CartProvider */}
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
