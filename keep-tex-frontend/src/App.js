import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { HomePage, NotFoundPage, ProductsPage, ProductDetailPage, ServicesPage, ServiceDetailPage, AboutPage, ContactPage, LoginPage, RegisterPage, OrderAToZPage, OrderPiecesCoupeesPage, UserOrdersPage, OrdersPage, OrderDetailsPage, OrderDetailPage } from './pages';
import SplashScreen from './components/SplashScreen';
import './App.css';
import './components/common/AdvancedAnimations.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Adjust time as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {showSplash && <SplashScreen />}
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Add more routes as they are developed */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/order/a-to-z" element={<OrderAToZPage />} />
          <Route path="/order/pieces-coupees" element={<OrderPiecesCoupeesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
          <Route path="/order/:orderId" element={<OrderDetailPage />} />
          <Route path="/user-orders" element={<UserOrdersPage />} />
          {/* Removed ProfilePage route as the page is deleted */}
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
          {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
