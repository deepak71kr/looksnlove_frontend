import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import OrderHistory from './pages/OrderHistory';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
