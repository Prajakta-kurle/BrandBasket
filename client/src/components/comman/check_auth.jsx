import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function CheckAuth({ isAuthenticated, children, user }) {
  const location = useLocation();

  console.log(location.pathname ,isAuthenticated)

  if (location.pathname === '/') {
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  } else {
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }
}


  // Not authenticated → redirect to login, unless already on login or register
  if (
    !isAuthenticated &&
    !(location.pathname.includes('/login') || location.pathname.includes('/register'))
  ) {
    return <Navigate to="/auth/login" />;
  }

  // Authenticated user tries to access login/register → redirect based on role
  if (
    isAuthenticated &&
    (location.pathname.includes('/login') || location.pathname.includes('/register'))
  ) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // Authenticated user with wrong role tries to access protected route
  if (isAuthenticated && user?.role !== 'admin' && location.pathname.includes('/admin')) {
    return <Navigate to="/unauth_page" />;
  }

  if (isAuthenticated && user?.role === 'admin' && location.pathname.includes('/shop')) {
    return <Navigate to="/admin/dashboard" />;
  }

  // ✅ If everything is valid, render children
  return <>{children}</>;
}

export default CheckAuth;
