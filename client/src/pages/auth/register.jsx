import React, { useState } from 'react';
import CommanForm from '../../components/comman/form';
import { registerFormControls } from '../../config';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '@/store/authslice';
import { toast } from "sonner";

const initialState = {
  userName: "", 
  email: "",
  password: ""
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
  
    try {
      const data = await dispatch(registerUser(formData)); // Await the dispatch action
  
      if (data?.payload?.success) {
        toast.success(data?.payload?.message || "Registration successful!");
        navigate("/auth/login");  // Navigate to login page after successful registration
      } else {
        toast.error(data?.payload?.message || "Registration failed.");
      }
    } catch (error) {
      console.log("Error during registration:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className='mx-auto space-y-6 w-full max-w-md'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Create new account</h1>
        <p className='mt-2'>
          Already have an account?
          <Link className='font-medium text-primary hover:underline ml-2' to="/auth/login"> Login</Link>
        </p>
      </div>

      <CommanForm
        formControls={registerFormControls}
        buttonText="Sign up"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthRegister;
