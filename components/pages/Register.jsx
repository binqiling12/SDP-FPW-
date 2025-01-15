import React, { useState } from "react";
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import "./Register.css";

const schema = Joi.object({
  username: Joi.string().required().min(3),
  email: Joi.string().email({ tlds: false }).required(),
  address: Joi.string().required(),
  password: Joi.string().required().min(6)
});

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(schema),
    mode: 'all'
  });

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await axios.post('http://localhost:3000/api/users', {
        username: data.username,
        email: data.email,
        password: data.password,
        address: data.address
      });
      
      if (response.status === 201) {
        setSubmitSuccess(true);
        reset();
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {submitSuccess && <p className="success-message">Registration successful!</p>}
      {submitError && <p className="error-message">{submitError}</p>}
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="form-group">
          <label>Username:</label>
          <input {...register('username')} />
          {errors.username && <p className="error-message">{errors.username.message}</p>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input {...register('email')} type="email" />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input {...register('address')} />
          {errors.address && <p className="error-message">{errors.address.message}</p>}
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input {...register('password')} type="password" />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
