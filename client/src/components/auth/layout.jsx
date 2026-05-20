import React from 'react';
import { Outlet } from 'react-router-dom';
import bgImage from '../../assets/Pictures/background.png';

function AuthLayout() {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >

      {/* Login/Signup Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
