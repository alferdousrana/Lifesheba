import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainRoutes from './routes/MainRoutes';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header /> {/* Navbar at top */}

        <main className="flex-grow-1">
          <MainRoutes /> {/* Main routing */}
        </main>

        <Footer /> {/* Sticky footer */}
      </div>
    </Router>
  );
}

export default App;
