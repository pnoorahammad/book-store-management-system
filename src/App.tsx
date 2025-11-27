import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { BookDetails } from './components/BookDetails';
import { AdminDashboard } from './components/AdminDashboard';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Cart } from './components/Cart';
import { Orders } from './components/Orders';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner@2.0.3';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/books/:id" element={<BookDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}