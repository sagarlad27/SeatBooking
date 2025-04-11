import React, { useState } from 'react';
import API from '../services/Api';
import Swal from 'sweetalert2';
import './Auth.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await API.post('/signup', { email, password });

      Swal.fire({
        icon: 'success',
        title: 'Signup successful!',
        text: 'Now you can log in.',
        timer: 2000,
        showConfirmButton: false,
      });
      navigate('/login');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: error.response?.data?.error || 'Email might already be in use.',
      });
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <input
        className="auth-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="auth-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="auth-button" onClick={handleSignup}>
        Signup
      </button>
      <p>
        Already have an account?{' '}
        <span className="auth-link" onClick={() => navigate('/login')}>Login</span>
      </p>
    </div>
  );
};

export default Signup;