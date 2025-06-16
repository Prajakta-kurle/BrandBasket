import React, { useState, useEffect } from 'react';
import CommanForm from '../../components/comman/form';
import { loginFormControls } from '../../config';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/store/authslice';
import { toast } from "sonner";

const initialState = {
  email: "",
  password: ""
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Retrieve `isAuthenticated` and `user` from the Redux store
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  console.log('isAuthenticated:', isAuthenticated, 'user:', user);

  useEffect(() => {
    // Check if the user is authenticated and navigate to the correct page
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate("/admin/dashboard");  // Navigate to admin dashboard after successful login
      } else {
        navigate("/shop/home");  // Navigate to shop home if not an admin
      }
    }
  }, [isAuthenticated, user, navigate]);  // Dependencies: Will run whenever `isAuthenticated` or `user` changes

  function onSubmit(e) {
    e.preventDefault();

    dispatch(loginUser(formData))
      .then((data) => {
        if (data?.payload?.success) {
          toast.success(data?.payload?.message || "Login successful!");
        } else {
          toast.error(data?.payload?.message || "Login failed.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        toast.error("Something went wrong. Please try again.");
      });
  }

  return (
    <div className='mx-auto space-y-6 w-full max-w-md'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Sign in to your account</h1>
        <p className='mt-2'>
          Don't have an account?
          <Link className='font-medium text-primary hover:underline ml-2' to="/auth/register">Register</Link>
        </p>
      </div>

      <CommanForm
        formControls={loginFormControls}
        buttonText="Sign in"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthLogin;
