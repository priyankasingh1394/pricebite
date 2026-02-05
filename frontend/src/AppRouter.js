import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

// Components
import Navbar from './components/Navbar';
import App from './App';
import Products from './components/Products';
import Login from './components/Login';
import Register from './components/Register';
import Contact from './components/Contact';
import About from './components/About';
import ProtectedRoute from './components/ProtectedRoute';

const AppRouter = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<App />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <div>Profile Page - Coming Soon</div>
              </ProtectedRoute>
            } />
            <Route path="/shopping-lists" element={
              <ProtectedRoute>
                <div>Shopping Lists - Coming Soon</div>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <div>Settings - Coming Soon</div>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <div>Orders - Coming Soon</div>
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default AppRouter;
